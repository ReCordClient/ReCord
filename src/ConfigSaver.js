module.exports = function () {
    window.RC.Theme = {};

    window.RC.Theme.Enable = function (theme) {
        fetch('http://127.0.0.1:7251/enable_theme/' + theme, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/text'
            // },
            // body: JSON.stringify({
            //     theme: theme
            // })
        })
    }

    window.RC.Theme.Disable = function (theme) {
        fetch('http://127.0.0.1:7251/disable_theme/' + theme, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/text'
            // },
            // body: JSON.stringify({
            //     theme: theme
            // })
        })
    }
}