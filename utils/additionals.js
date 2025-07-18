export const staffIDGenerator = (length = 6) => {
    let staffID = "";
    for (let i = 0; i < length; i++) {
        staffID += Math.floor(Math.random() * 10)
    }
    return staffID;
};