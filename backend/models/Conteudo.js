const mongoose = require('mongoose');

const conteudoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['filme', 'serie']
  },
  generos: {
    type: [String],
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  sinopse: {
    type: String,
    required: true
  },
  temporadas: {
    type: Number
  }
});

module.exports = mongoose.model('Conteudo', conteudoSchema);