(() => {
    // sabitlerimiz:

    const PLANK_LENGTH = 400;
    const PIVOT = PLANK_LENGTH / 2;

    // state'imiz:
    const state = {
        items: [],
    }

    const plankElement = document.getElementById('plank');

    //loglarımız için:
    const logListElement = document.getElementById("logList");
    const logScrollElement = document.getElementById("log");
    const clearLogButton = document.getElementById("clearLogs");

    function appendLogLine(text) {
        if (!logListElement) return;
      
        const li = document.createElement("li");
        li.textContent = text;
        logListElement.appendChild(li);
      }
      
      if (clearLogButton && logListElement) {
        clearLogButton.addEventListener("click", () => {
          logListElement.innerHTML = "";
        });
      }
    
    // verdiğimiz aralıkta random ağırlık almak için
    function randInt(min, max) {
        return Math.floor(Math.random() * (max-min+1))+min;
    }

    //pozisyon alıyoruz
    function getClickOnPlank(event) {
        const rect=plankElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        return (x/rect.width)*PLANK_LENGTH;
    }

    //oluşturduğumuz itemi state.items gönderiyoruz
    function addRandomItem(x) {
        const weight=randInt(1,10);
        const item={
            id: crypto.randomUUID?.() ?? String(Date.now()),
            x,
            weight,
        };
        state.items.push(item);
        console.log("Added item: ", item);
    }

    //plank tıklaması
    function onPlankClick(event) {
        const x=getClickOnPlank(event);
        const distanceFromPivot=Math.abs(x-PIVOT)
        const side = x < PIVOT ? "Left" : "Right";
        const xRounded = Math.round(x);
        const dRounded = Math.round(distanceFromPivot);
        const sideLabel = side;
        appendLogLine(`Clicked → ${sideLabel} | x=${xRounded}px | Distance from pivot=${dRounded}px`);
        console.log({ x, side, distanceFromPivot });

        addRandomItem(x);
    }

    plankElement.addEventListener("click", onPlankClick);
  
})();
