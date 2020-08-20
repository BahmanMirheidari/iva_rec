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
    },

    makeLikes: (field_names) => {
    	try{
	    	result = ''
		    Object.keys(field_names).forEach(function(key) {
		        var newlike = key + ' LIKE `%' + field_names[key] + '%` '
		        if (result === '')
		            result = newlike;
		        else
		            result += 'OR ' + newlike 
		    }); 

		    return result;
		}
		catch(e){
		    return "";
		} 
	}
}; 
