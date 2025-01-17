const ssweb = require('./index');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const stream = require('stream');
const uploadFileFromCaliph = require('./lib/uploadFile');
const { author } = require('./index');


// Buffer tu stream...
const createStream = (binary) => {
    return new stream.Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
}
// check URL...
const isUrl = (uri) => {
    return uri.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}

app.set("json spaces", 4)

app.get('/', async (req, res) => {
    const link_github = "https://github.com/cakrayp/ssweb-api-caliph.git";
    res.send("<code>Hello welcome to my Rest API, I was created server for web screenshot from source code, Please visit here <a href=" + link_github + ">" + link_github + "</a></code>")
})


app.get('/ssweb/desktop', async (req, res) => {
    var url = req.query.url,
        responsetype = req.query.responsetype

    if (!url) return res.json({ status: false, creator: "Cakrayp & Caliph", message: "please enter URL for web screenshot" })

    ssweb.desktop({ url })
        .then(async (buff) => {
            if (isUrl(url)) {
                if (/^image(s|)$/.test(responsetype)) {
                    createStream(buff).pipe(res)
                } else {
                    uploadFileFromCaliph(buff)
                        .then(result => {
                            res.json({
                                status: 200,
                                creator: "Cakrayp & Caliph",
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            })
                        })
                }
            } else {
                res.json({
                    status: 403,
                    creator: "Cakrayp & Caliph",
                    message: "this is specific to url."
                })
            }
        })
})


app.get('/ssweb/handphone', async (req, res) => {
    var url = req.query.url,
        responsetype = req.query.responsetype

    if (!url) return res.json({ status: false, creator: "Cakrayp & Caliph", message: "please enter URL for web screenshot" })

    ssweb.handphone({ url })
        .then(async (buff) => {
            if (isUrl(url)) {
                if (/^image(s|)$/.test(responsetype)) {
                    createStream(buff).pipe(res)
                } else {
                    uploadFileFromCaliph(buff)
                        .then(result => {
                            res.json({
                                status: 200,
                                creator: "Cakrayp & Caliph",
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            })
                        })
                }
            } else {
                res.json({
                    status: 403,
                    creator: "Cakrayp & Caliph",
                    message: "this is specific to url."
                })
            }
        })
})


app.use(async(req, res) => {
    res.send("<code>404 Not found</code>")
})


app.listen(port, () => {
    console.log('Server is running on port : ' + port)
})
