const exec = require('child_process').exec
const args = require('minimist')(process.argv.slice(2))

const dependence = function(cb) {
    exec('yarn install', function(err, stdout, stderr) {
        if (stderr) {
            cb(1)
            return
        }
        console.log(stdout)
        console.log('依赖检测完成...')
        cb(0)
    })
}

const lint = function(cb) {
    exec('./node_modules/eslint/bin/eslint.js --ext .js,.wpy src --cache --max-warnings=0', function(err, stdout, stderr) {
        if (stdout) {
            console.log(stdout)
            cb(1)
            return
        }
        console.log('代码规范检测完成...')
        cb(0)
    })
}

const taskList = [dependence, lint]

const execTask = function() {
    if (!taskList.length) {
        process.exit(0)
        return
    }
    const func = taskList.shift()
    func(function(pass) {
        if (pass === 1) {
            process.exit(1)
            return
        }
        execTask()
    })
}

execTask()
