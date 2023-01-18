function convertSize(sizeInBytes: number): string{
    if(convertToKilobytes(sizeInBytes) < 1024){
        return convertToKilobytes(sizeInBytes).toFixed(2) + " kB"
    }else if(convertToMegabytes(sizeInBytes) < 1024){
        return convertToMegabytes(sizeInBytes).toFixed(2) + " MB"
    }else{
        return convertToGigabytes(sizeInBytes).toFixed(2)  + " GB"
    }
}

function convertToKilobytes(sizeInBytes: number): number{
    if(sizeInBytes < 0 || isNaN(sizeInBytes)){
        return 0;
    }
    return sizeInBytes / 1024;
}

function convertToMegabytes(sizeInBytes: number): number{
    if(sizeInBytes < 0 || isNaN(sizeInBytes)){
        return 0;
    }
    return convertToKilobytes(sizeInBytes) / 1024;
}

function convertToGigabytes(sizeInBytes: number): number{
    if(sizeInBytes < 0 || isNaN(sizeInBytes)){
        return 0;
    }
    return convertToMegabytes(sizeInBytes) / 1024;
}

export {convertSize, convertToKilobytes, convertToMegabytes, convertToGigabytes};