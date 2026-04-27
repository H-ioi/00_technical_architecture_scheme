export function download(res, name = "download") {
    let index = name.indexOf("=");
    let downloadname = decodeURIComponent(
        name.substring(index + 1)
    );
    let binaryData = [];
    binaryData.push(res);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = window.URL.createObjectURL(new Blob(binaryData));
    link.setAttribute("download", downloadname);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export function downloadFile(res, name) {
    let binaryData = [];
    binaryData.push(res);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = window.URL.createObjectURL(new Blob(binaryData));
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}