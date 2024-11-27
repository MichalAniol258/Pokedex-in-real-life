// middleware/auth.js
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Jeśli zalogowany, kontynuuj
    }
    return res.status(401).json({ error: 'Unauthorized' }); // Jeśli nie, zwróć błąd
}

module.exports = { checkAuthenticated };
