
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const userRegex = /[^A-Za-z0-9]+/;
const literalRegex = /[A-Za-z]+/;
const intRegex = /[0-9]/
const specialRegex = /[!@#$%^&*(),.?":{}|<>]/


exports.isUserValid = function(user) {
	if (!user)
		return false;

	if (user.length > 20) 
		return false;

	if (user.length < 3)
		return false;

	valid = userRegex.test(user)
	if (valid)
		return false;

	return true
}

exports.isPassValid = function(pass) {
	sp_valid = specialRegex.test(pass);
	lit_valid = literalRegex.test(pass)
	int_valid = intRegex.test(pass)
	if(!sp_valid || !lit_valid || !int_valid)
		return false;

	if(pass.length < 8)
		return false;


	return true
}

exports.isEmailValid = function(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

     if(parts[0].length<2)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    if(domainParts.some(function(part) { return part.length<2; }))
        return false;

    return true;
}
