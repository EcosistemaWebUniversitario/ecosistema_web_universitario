// src/routes/auth.js
const express = require('express');
const router  = express.Router();

// Redirigir cualquier intento de login/registro al auth-service central
router.get('/login', (req, res) => res.redirect('/auth/login'));
router.post('/login', (req, res) => res.redirect('/auth/login'));
router.get('/registro', (req, res) => res.redirect('/auth/registro'));
router.post('/registro', (req, res) => res.redirect('/auth/registro'));
router.get('/logout', (req, res) => res.redirect('/auth/logout'));
router.get('/dashboard', (req, res) => res.redirect('/auth/dashboard'));

// Eliminamos el endpoint de cambio de contraseña (lo gestiona auth-service)

module.exports = router;