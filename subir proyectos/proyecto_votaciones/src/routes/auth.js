// src/routes/auth.js
const express = require('express');
const router  = express.Router();

// Redirigir cualquier intento de login/registro al auth-service central
router.get('/login', (req, res) => res.redirect('/auth/login'));
router.post('/login', (req, res) => res.redirect('/auth/login'));
router.get('/admin-login', (req, res) => res.redirect('/auth/login'));
router.post('/admin-login', (req, res) => res.redirect('/auth/login'));
router.get('/registro', (req, res) => res.redirect('/auth/registro'));
router.post('/registro', (req, res) => res.redirect('/auth/registro'));
router.get('/logout', (req, res) => res.redirect('/auth/logout'));

module.exports = router;