import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DetailRowSchema = new Schema({
  Activo: { type: String, default: 'S' },
  Borrado: { type: String, default: 'N' },
  detail_row_reg: [{
    FechaReg: { type: Date, default: Date.now },
    UsuarioReg: { type: String }
  }]
});
const EstatusSchema = new Schema({
  IdTipoEstatusOK: { type: String },
  Actual: { type: String },
  Observacion: { type: String },
  detail_row: DetailRowSchema
});
const InfoAdSchema = new Schema({
  IdEtiquetaOK: { type: String },
  IdEtiqueta: { type: String },
  Etiqueta: { type: String },
  Valor: { type: String },
  IdTipoSeccionOK: { type: String },
  Secuencia: { type: Number },
  detail_row: DetailRowSchema
});
const PaqueteSchema = new Schema({
  IdPresentaOK: { type: String },
  DesPresenta: { type: String },
  Cantidad: { type: Number },
  detail_row: DetailRowSchema
});
const ArchivoSchema = new Schema({
  IdArchivoOK: { type: String },
  IdArchivoBK: { type: String },
  DesArchivo: { type: String },
  RutaArchivo: { type: String },
  Path: { type: String },
  IdTipoArchivoOK: { type: String },
  IdTipoSeccionOK: { type: String },
  Secuencia: { type: Number },
  Principal: { type: String },
  detail_row: DetailRowSchema
});
const PresentacionSchema = new Schema({
  IdPresentaOK: { type: String },
  IdPresentaBK: { type: String },
  CodigoBarras: { type: String },
  DesPresenta: { type: String },
  Indice: { type: String },
  Principal: { type: String },
  estatus: [EstatusSchema],
  info_vta: [{ type: Schema.Types.Mixed }],
  info_ad: [InfoAdSchema],
  paquete: [PaqueteSchema],
  archivos: [ArchivoSchema],
  detail_row: DetailRowSchema
});
const NegocioSchema = new Schema({
  IdNegocioOK: { type: String },
  detail_row: DetailRowSchema
});
const ProdServSchema = new Schema({
  IdInstitutoOK: { type: String },
  IdProdServOK: { type: String },
  IdProdServBK: { type: String },
  CodigoBarras: { type: String },
  DesProdServ: { type: String },
  Indice: { type: String },
  estatus: [EstatusSchema],
  presentaciones: [PresentacionSchema],
  archivos: [ArchivoSchema],
  negocios: [NegocioSchema],
  info_ad: [InfoAdSchema],
  detail_row: DetailRowSchema
});

module.exports = mongoose.model('cat_productos', ProdServSchema);
