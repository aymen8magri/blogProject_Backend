const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

filename = ''
const mystorage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, redirect) => {
        let date = Date.now();
        let fl = date + "." + file.mimetype.split('/')[1];
        redirect(null, fl);
        filename = fl;
    }
})
const upolad = multer({ storage: mystorage })

router.post('/register', upolad.any('image'), (req, res) => {
    data = req.body
    author = new Author(data)
    author.image = filename

    salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password, salt)

    author.save()
        .then(
            (authorSaved) => {
                res.status(200).send(authorSaved)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})

router.post('/login', (req, res) => {
    let data = req.body
    Author.findOne({ email: data.email })
        .then(
            (author) => {
                let validPass = bcrypt.compareSync(data.password, author.password)
                if (!validPass) {
                    res.send("email or password invalid");
                }
                else {
                    let payload = {
                        _id: author.id,
                        email: author.email,
                        fullname: author.name + ' ' + author.lastName
                    }
                    let token = jwt.sign(payload, '123456789');
                    res.send({ mytoken: token })
                }
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})

router.get('/all', (req, res) => {
    Author.find({})
        .then(
            (authors) => {
                res.status(200).send(authors)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})

router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id
    Author.findById({ _id: id })
        .then(
            (author) => {
                res.status(200).send(author)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})

router.delete('/supprimer/:id', (req, res) => {
    let id = req.params.id
    Author.findByIdAndDelete({ _id: id })
        .then(
            (author) => {
                res.status(200).send(author)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})

router.put('/update/:id',upolad.any('image'), (req, res) => {
    let id = req.params.id
    let data = req.body

    if (filename.length > 0) {
        data.image = filename
    }

    Author.findByIdAndUpdate({ _id: id }, data)
        .then(
            (author) => {
                res.status(200).send(author)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )

})



module.exports = router;