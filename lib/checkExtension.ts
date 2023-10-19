export function checkFile(fileName: string | null) {
  const allowedExtension = [".jpg", ".jpeg", ".png", ".gif"];
  if (fileName) {
    const fileExtension = fileName
      .toLowerCase()
      .slice(fileName.lastIndexOf("."));
    return allowedExtension.includes(fileExtension);
  } else {
    return false;
  }
}
