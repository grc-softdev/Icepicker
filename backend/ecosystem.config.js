module.export = {
    apps: [
        {
            name: "icepicker",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development"
            }
        }
    ]
}