export const formatDate = (isoDate) => {
    if(isoDate===null){
        return "";
    }

    const date = isoDate.split('T')[0].split('-');
  
    return `${date[2]}-${date[1]}-${date[0]}`;
};