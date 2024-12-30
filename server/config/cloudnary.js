const cloudinary = require('cloudinary').v2

const connectCloudinary = async() => {
    cloudinary.config({
        cloud_name: "dqtwzcjvp",
        api_key: 559698791586716,
        api_secret: "-1wJ9u77BW88_7laNYFGYE7WlOE"
    })
}

module.exports = connectCloudinary