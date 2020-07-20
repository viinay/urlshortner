const yup = require('yup');

const urlSchema = yup.object().shape({
    url:yup.string().trim().url().required(),
    slug:yup.string().trim()
})

module.exports = urlSchema;