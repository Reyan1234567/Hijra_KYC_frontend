  /*
 * HIJRA KYC FRONTEND - DISPLAY UTILITY FUNCTIONS
 * 
 * FILE TYPE: Utility/Helper Functions
 * PURPOSE: Common display formatting and file conversion utilities
 * 
 * FUNCTIONALITY:
 * - Date formatting for display in UI components
 * - File to Base64 conversion for image handling
 * - Standardized display formats across the application
 * 
 * EXPORTED FUNCTIONS:
 * - ExtractDate: Formats Date objects to readable string format
 * - toBase64: Converts File objects to Base64 strings for image display
 * 
 * USED BY: Multiple components for consistent date/image display
 */

  export const ExtractDate = (date: Date) => {
    if (date === null) return "-----------";
    else {
      const day = new Date(date);
      return `${day.getMonth()+1}/${day.getDate()}/${day.getFullYear()}  ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
    }
  };

  export const toBase64 = (image: File | undefined | null) => {
    console.log("in the base64");
    if (image === null || undefined) {
      console.log("consoled out because image was either null or undefined")
      return;
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      if (image) {
        reader.readAsDataURL(image);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to parse or some shit"));
          }
        };
        reader.onerror = () => {
          reject(new Error("Failed mf"));
        };
      } else {
        reject(new Error("Failed mf"));
      }
    });
  };