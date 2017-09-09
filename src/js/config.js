//import style from '../css/slack.files_extension.scss'

export default {
    env: process.env.NODE_ENV,
    debug: process.env.NODE_ENV === 'development',
    simulation: process.env.NODE_ENV === 'development',
    promptDelete: true,
    anim: {
        delay: 40,
        time: 200
    },
    maxSelect: 200,
    //styles: [style]
}