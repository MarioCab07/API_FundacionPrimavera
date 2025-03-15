const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();


module.exports = {
    sanitizeName
}


