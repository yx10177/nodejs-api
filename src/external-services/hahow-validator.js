exports.isNeedToCheckAuth = (args) => {
    return args.name || args.password;
}