const mongoose = require("mongoose");

const SettingGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
}, {
    timestamps: true
});

const SettingGeneral = mongoose.model("SettingGeneral", SettingGeneralSchema, "settings-general");

module.exports = SettingGeneral;