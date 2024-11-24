import * as mongoose from "mongoose";

const ProdServSchema = new mongoose.Schema({
    IdInstitutoOK: {type: String},
    IdProdServOK: {type: String},
    IdProdServBK: {type: String},
    CodigoBarras: {type: String},
    DesProdServ: {type: String},
    Indice: {type: String},
    estatus: [
        {
            _id: false,
            IdTipoEstatusOK: {type: String},
            Actual: {type: String, default: 'S'},
            Observacion: {type: String},
            detail_row: {
                Activo: {type: String, default: 'S'},
                Borrado: {type: String, default: 'N'},
                detail_row_reg: [
                    {
                        _id: false,
                        FechaReg: {type: Date, default: Date.now()},
                        UsuarioReg: {type: String, default: 'SYSTEM'}
                    },
                ],
            },
        },
    ],
    info_ad: [
        {
            _id: false,
            IdEtiquetaOK: {type: String},
            IdEtiqueta: {type: String},
            Valor: {type: String},
            IdTipoSeccionOK: {type: String},
            Secuencia: {type: Number},
            detail_row: {
                Activo: {type: String},
                Borrado: {type: String},
                detail_row_reg: [
                    {
                        _id: false,
                        FechaReg: {type: Date, default: Date.now()},
                        UsuarioReg: {type: String, default: 'SYSTEM'},

                    },
                ],
            },
        },
    ],
    presentaciones: [
        {
            _id: false,
            IdPresentaOK: {type: String},
            IdPresentaBK: {type: String},
            CodigoBarras: {type: String},
            DesPresenta: {type: String},
            Indice: {type: String},
            info_ad: [
                {
                    _id: false,
                    IdEtiquetaOK: {type: String},
                    IdEtiqueta: {type: String},
                    Valor: {type: String},
                    IdTipoSeccionOK: {type: String},
                    Secuencia: {type: Number},
                    detail_row: {
                        Activo: {type: String, default: 'S'},
                        Borrado: {type: String, default: 'N'},
                        detail_row_reg: [
                            {
                                FechaReg: {type: Date, default: Date.now},
                                UsuarioReg: {type: String},
                                _id: false,
                            },
                        ],
                    },
                },
            ],
            paquete: [
                {
                    _id: false,
                    IdPresentaOK: {type: String},
                    DesPresenta: {type: String},
                    Cantidad: {type: Number},
                    detail_row: {
                        _id: false,
                        Activo: {type: String, default: 'S'},
                        Borrado: {type: String, default: 'N'},
                        detail_row_reg: [
                            {
                                _id: false,
                                FechaReg: {type: Date, default: Date.now()},
                                UsuarioReg: {type: String, default: 'SYSTEM'}
                            }
                        ]
                    },
                },
            ],
            archivos: [
                {
                    _id: false,
                    IdArchivoOK: {type: String},
                    IdArchivoBK: {type: String},
                    DesArchivo: {type: String},
                    RutaArchivo: {type: String},
                    IdTipoArchivoOK: {type: String},
                    Archivo: {type: String},
                    IdTipoSeccionOK: {type: String},
                    Secuencia: {type: Number},
                    Principal: {type: String},
                    detail_row: {
                        Activo: {type: String, default: 'S'},
                        Borrado: {type: String, default: 'N'},
                        detail_row_reg: [
                            {
                                _id: false,
                                FechaReg: {type: Date, default: Date.now()},
                                UsuarioReg: {type: String, default: 'SYSTEM'}

                            },
                        ],
                    },
                },
            ],
            detail_row: {
                _id: false,
                Activo: {type: String, default: 'S'},
                Borrado: {type: String, default: 'N'},
                detail_row_reg: [
                    {
                        _id: false,
                        FechaReg: {type: Date, default: Date.now()},
                        UsuarioReg: {type: String, default: 'SYSTEM'}
                    }
                ]
            },
        },
    ],
    negocios: [
        {
            _id: false,
            IdNegocioOK: {type: String},
            detail_row: {
                _id: false,
                Activo: {type: String, default: 'S'},
                Borrado: {type: String, default: 'N'},
                detail_row_reg: [
                    {
                        _id: false,
                        FechaReg: {type: Date, default: Date.now},
                        UsuarioReg: {type: String},
                    },
                ],
            },
        }
    ],
    detail_row: {
        Activo: {type: String, default: 'S'},
        Borrado: {type: String, default: 'N'},
        detail_row_reg: [
            {
                FechaReg: {type: Date, default: Date.now()},
                UsuarioReg: {type: String, default: 'SYSTEM'},
                _id: false,
            },
        ],
    },
}, {versionKey: false});

module.exports = mongoose.model('cat_productos', ProdServSchema);
