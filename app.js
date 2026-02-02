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

    //istatistik verilerimiz için
    const statLeftEl = document.getElementById("statLeft");
    const statAngleEl = document.getElementById("statAngle");
    const statRightEl = document.getElementById("statRight");

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

    //tork hesaplaması
    function calculateTorque(items) {
        let leftTorque=0;
        let rightTorque=0;

        for(const item of items){
            if(item.x<PIVOT){ //sol taraftaysa
                const distance=PIVOT-item.x;
                leftTorque+=item.weight*distance;
            } else{ //sağ taraftaysa
                const distance=item.x-PIVOT;
                rightTorque+=item.weight*distance;

            }
        }
        return {leftTorque, rightTorque};
    }

    //rotasyon angle hesaplaması
    function calculateAngle(leftTorque, rightTorque){
        return Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
    }

    //stat göstermek için
    function calculateSideWeights(items){
        let leftWeight=0;
        let rightWeight=0;

        for(const item of items){
            if(item.x<PIVOT){
                leftWeight+=item.weight;
            }else{
                rightWeight+=item.weight;
            }
        }
        return {leftWeight,rightWeight};
    }

    //rotasyon renderı için
    function renderAngle(angleDegree){
        plankElement.style.transform=`translateX(-50%) rotate(${angleDegree}deg)`;
    }

    //item layer
    function getOrCreateItemsLayer(){
        let layer=plankElement.querySelector(".itemsLayer");
        if(!layer){
            layer=document.createElement("div");
            layer.className="itemsLayer";
            plankElement.appendChild(layer);
        }
        return layer;
    }

    //element oluşturup layera ekliyoruz
    function renderItems(){
        const layer=getOrCreateItemsLayer();
        layer.innerHTML="";

        for(const item of state.items){
            const el=document.createElement("div");
            el.className="seesawItem";
            el.dataset.id=item.id;

            const leftPercent=(item.x/PLANK_LENGTH)*100; //ilgili noktaya yerleştirmek için plank uzunluğu ile yüzdelik aldık
            el.style.left=`${leftPercent}%`;

            el.textContent=`${item.weight}kg`; //daire içindeki weight verisi
            layer.appendChild(el);
        }
    }

    //state değişikliklerini render ediyoruz
    function updateSeesaw(){
        const {leftTorque, rightTorque}=calculateTorque(state.items);
        const {leftWeight,rightWeight}=calculateSideWeights(state.items);
        const angle=calculateAngle(leftTorque, rightTorque);

        renderAngle(angle);
        renderItems();

        if (statLeftEl) statLeftEl.textContent = `${leftWeight}kg`;
        if (statAngleEl) statAngleEl.textContent = `${angle.toFixed(2)}°`;
        if (statRightEl) statRightEl.textContent = `${rightWeight}kg`;

        //log güncellemeis
        appendLogLine(`Torque L=${leftTorque.toFixed(1)} | R=${rightTorque.toFixed(1)} → angle=${angle.toFixed(2)}°`);
    }

    //plank tıklaması->click event başlangıç noktası
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
        updateSeesaw();
    }

    plankElement.addEventListener("click", onPlankClick);
  
})();
