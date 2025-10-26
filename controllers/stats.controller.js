const Beneficiary = require('../models/beneficiary.model');
const debug = require('debug')('app:statsController');

const controller = {};



controller.barChartStats = async (req, res, next) => {
    try {
    const fields = [
      "blood_type",
      "house_condition",
      "municipality",
      "education_level",
      "income_type",
      "phone_company",
      "shirt_size",
      "shoe_size"
    ];
    const results = {}; 
    for (const field of fields) {
      results[field] = await Beneficiary.aggregate([
        { $group: { _id: `$${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    }
    
        results.age = await Beneficiary.aggregate([
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 12, 18, 30, 50, 70, 100],
          default: "Desconocido",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    results.total = await Beneficiary.countDocuments();

    return res.status(200).json({ stats: results });
    
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
}

controller.circularChartStats = async (req, res, next) => {
  try {
    const results = {};

    // Teléfono
results.phone = {
  with: await Beneficiary.countDocuments({
    phone_number: { $nin: ["", null] }
  }),
  without: await Beneficiary.countDocuments({
    $or: [{ phone_number: "" }, { phone_number: null }]
  })
};

    // Leer y escribir
    results.write_and_read = {
      yes: await Beneficiary.countDocuments({ write_and_read: true }),
      no: await Beneficiary.countDocuments({ write_and_read: false })
    };

    // WhatsApp
    results.whatsapp = {
      yes: await Beneficiary.countDocuments({ whatsapp: true }),
      no: await Beneficiary.countDocuments({ whatsapp: false })
    };

    // Responsable
    results.person_in_charge = {
      with: await Beneficiary.countDocuments({ "person_in_charge.name": { $ne: "N/A" } }),
      without: await Beneficiary.countDocuments({ "person_in_charge.name": "N/A" })
    };

    // Dependientes
    results.dependents = {
      with: await Beneficiary.countDocuments({ dependents: { $exists: true, $ne: [] } }),
      without: await Beneficiary.countDocuments({ $or: [{ dependents: { $size: 0 } }, { dependents: null }] })
    };

    // Salud (discapacidad o enfermedad distinta de N/A)
    results.health = {
      with: await Beneficiary.countDocuments({
        $or: [{ discapacities: { $ne: "N/A" } }, { illness: { $ne: "N/A" } }]
      }),
      without: await Beneficiary.countDocuments({ discapacities: "N/A", illness: "N/A" })
    };

    // Género
    results.gender = await Beneficiary.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    // Departamento
    results.department = await Beneficiary.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    // Zona
    results.zone = await Beneficiary.aggregate([
      { $group: { _id: "$zone", count: { $sum: 1 } } }
    ]);

    // Transporte
    results.transportation = {
      difficulty: await Beneficiary.countDocuments({ "transportation.difficulty": true }),
      available: await Beneficiary.countDocuments({ "transportation.person_available": true })
    };

    return res.status(200).json({ stats: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


controller.crossFilterStats = async (req, res, next) => {
    try {
          const { field1, field2 } = req.query;

  if (!field1 || !field2) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }
    const results = await Beneficiary.aggregate([
      {
        $group: {
          _id: { [field1]: `$${field1}`, [field2]: `$${field2}` },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          [field1]: "$_id." + field1,
          [field2]: "$_id." + field2,
          count: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({ stats: results });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
module.exports = controller;