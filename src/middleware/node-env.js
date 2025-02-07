import { getNav } from '../utilities/index.js';
// Code omitted for brevity...

const configureNodeEnvironment = async (req, res, next) => {
    res.locals.navHTML = await getNav();
};

const mode = process.env.MODE;
const port = process.env.PORT;
const reload = function(req, res, next) {
    res.locals.isDevMode = mode.includes('dev');
    const devModeMsg = '<p class="dev-mode-msg">Warning: Development Mode Enabled</p>';
    const devModeStyle = 'body{background-color: skyblue;}';
    const livereloading = `<script>
    const ws = new WebSocket(\`ws://127.0.0.1:${parseInt(port) + 1}\`);
        ws.onclose = () => {
        setTimeout(() => location.reload(), 1000);
    }; </script>`
    res.locals.scripts = [];
    res.locals.styles = [];
    if(res.locals.isDevMode){
        res.locals.scripts.push(devModeMsg);
        res.locals.scripts.push(livereloading);
        res.locals.styles.push(devModeStyle);
    }
    next();
};

export default reload;