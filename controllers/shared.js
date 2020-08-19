// controllers/shared.js 
module.exports = { 
    safeString: (dirtyString, max_len = 100) => {
	//        return dirtyString.substring(0, max_len).replace(/[\|&;\$%"'`!<>\(\)\+,]/g, "");
	try{
	    return dirtyString.substring(0, max_len).replace(/[^a-z0-9@\-,. ]/gi,'');
	}
	catch(e){
	    return "";
	}
    }   
}; 
