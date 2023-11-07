import { fabric } from 'fabric';
import './style.css';

const el = document.getElementById('canvas',) as HTMLCanvasElement;
const canvas: fabric.Canvas = new fabric.Canvas(el,{
    backgroundColor: "transparent"
});
// const canvas = (window.canvas = new fabric.Canvas(el));

//  edit from here
canvas.setDimensions({
    width: 200,
    height:100,
});
const textValue = 'fabric.js';
const text = new fabric.Textbox(textValue, {
    originX: 'center',
    splitByGrapheme: true,
    width: 200,
    top: 20,
    //@ts-ignore
    styles: fabric.util.stylesFromArray(
        [
            {
                style: {
                    fontWeight: 'bold',
                    fontSize: 64,
                },
                start: 0,
                end: 9,
            },
        ],
        textValue
    ),
});
canvas.add(text);
canvas.centerObjectH(text);
function animate(toState) {
    text.animate(
        { scaleX: Math.max(toState, 0.1) * 2 },
        {
            onChange: () => canvas.renderAll(),
            onComplete: () => animate(!toState),
            duration: 1000,
            easing: toState
                ? fabric.util.ease.easeInOutQuad
                : fabric.util.ease.easeInOutSine,
        }
    );
}
// animate(1);



////////////////// Image related code start ////////////////////////////////

const imageInput: HTMLInputElement | null = document.getElementById("imageInput") as HTMLInputElement;
console.log(imageInput,"imageInput")
  // Add an event listener to the input element
  imageInput?.addEventListener("change", function (e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File | undefined = target.files ? target.files[0] : undefined;

    console.log(canvas,"canva1111111111111canvascanvas")
    if (file) {
      // Create a FileReader to read the selected image file
      const reader: FileReader = new FileReader();

      reader.onload = function (event: ProgressEvent<FileReader>) {
        if (event.target) {
      console.log(canvas,"canva1111111111111144444444444canvascanvas")

          // Create a Fabric.js image object using the loaded image data
          const imgData: string = event.target.result as string;
          fabric.Image.fromURL(imgData, function (img: fabric.Image) {
            // Add the image to the canvas
            if (canvas) {
              console.log(canvas,"canvascanvascanvas")
              canvas.add(img);

              // You can manipulate the image properties here if needed
              img.set({
                left: 50,
                top: 50,
                scaleX: 0.5,
                scaleY: 0.5,
              });

              // Render the canvas
              canvas.renderAll();
            }
          });
        }
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  });


  //////////// Image related code end ///////////////////////////////////////////////////////


//// Detete related code start //////////////////////////

// Function to delete all selected objects

const deleteSelectedObjects = () => {
    const selectedObjects: fabric.Object[] = canvas.getActiveObjects();
  
    selectedObjects.forEach((object: fabric.Object) => {
      if (canvas) {
        canvas.remove(object);
      }
    });
  
    if (canvas) {
      canvas.discardActiveObject(); // Deselect all objects
      canvas.renderAll(); // Render the canvas
    }
  };

const deleteButton = document.getElementById("deleteButton")

deleteButton?.addEventListener("click",deleteSelectedObjects)
  
  //// Detete related code end //////////////////////////

  const logoColor = document.getElementById("logoColor")
console.log(logoColor)
  logoColor?.addEventListener("change",()=>{
    const selectedObject = canvas.getActiveObject();
    console.log("color changed22222222")

    if (selectedObject && selectedObject.type === 'path') {
      selectedObject.set({ fill: '#FF0000' }); // Change the fill color here
      canvas.renderAll();
      console.log("color changed")
    }
  
  })

