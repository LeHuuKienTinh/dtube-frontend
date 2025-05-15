// // ultis/disableDevTools.js
// export const disableDevTools = () => {
//     // Ngăn mở devtools bằng phím F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U...
//     const blockKeys = (e) => {
//       if (
//         e.key === "F12" ||
//         (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
//         (e.ctrlKey && e.key === "U")
//       ) {
//         e.preventDefault();
//       }
//     };
  
//     // Ngăn mở chuột phải
//     const blockContextMenu = (e) => e.preventDefault();
  
//     // Tự động disable console
//     const disableConsole = () => {
//       for (let method in console) {
//         if (typeof console[method] === "function") {
//           console[method] = () => {};
//         }
//       }
//     };
  
//     // Gán sự kiện khi load
//     window.addEventListener("keydown", blockKeys);
//     window.addEventListener("contextmenu", blockContextMenu);
//     disableConsole();
//   };
  