(() => {
    // sabitlerimiz:

    const PLANK_LENGTH = 400;
    const PIVOT = PLANK_LENGTH / 2;

    const STORAGE_KEY="seesaw_state";

    // state'imiz:
    const state = {
        items: [],
        logs: [], //logları da saklamk için
    }

    const plankElement = document.getElementById('plank');

    //loglarımız için:
    const logListElement = document.getElementById("logList");
    const clearLogButton = document.getElementById("clearLogs");

    //istatistik verilerimiz için
    const statLeftEl = document.getElementById("statLeft");
    const statAngleEl = document.getElementById("statAngle");
    const statRightEl = document.getElementById("statRight");

    //reset butonumuz içibn
    const resetButton=document.getElementById("resetButton");

    function appendLogLine(text) {
        state.logs.unshift(text); //yukarıdan eklememiz gerekiyor log formatımız için
        if (!logListElement) return;
      
        const li = document.createElement("li");
        li.textContent = text;
        logListElement.prepend(li);
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

        return item;
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
    
    //seesaw plankin stateini localstoragea atmak için
    function saveSeesawState(){
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                items: state.items,
                logs: state.logs
            }));
        } catch (error) {
            console.warn("Failed to save seesaw state:", error);
        }
    }

    //sayfa refresh edildiğinde statei yüklemek için
    function loadSeesawState(){
        try {
            const raw=localStorage.getItem(STORAGE_KEY);

            if(!raw){
                return;
            }
            
            const data=JSON.parse(raw);
            if (Array.isArray(data?.items)) state.items=data.items;
            if (Array.isArray(data?.logs)) state.logs=data.logs;

            updateSeesaw();
            renderLogs();

        } catch (error) {
            console.warn("Failed to load state:", error);
            state.items=[];
            state.logs=[];
        }
    }

    //logları refresh atıldığında tekrar çekmek için
    function renderLogs(){
        if(!logListElement) return;

        logListElement.innerHTML=""; 

        for(const line of state.logs){
            const li=document.createElement("li"); 
            li.textContent=line; 
            logListElement.appendChild(li); //yukarıda state.logs zaten unshift tutuyoruz burada gerek yok yani 
        }
    }

    //reset butonu aksiyonu
    function resetPlank(){
        state.items=[];
        state.logs= []; //logları da temizle 
        localStorage.removeItem(STORAGE_KEY);

        //log temizleme
        if(logListElement){
            logListElement.innerHTML="";
        }

        updateSeesaw();
    }

    //log temizleme btonu (yalnızca loglar temizlenmek istenirse)
    function clearLogs(){
        state.logs=[];
        if(logListElement){
            logListElement.innerHTML= "";
        }

        //storagedan da temizlememiz lazım yani anahtarla getirip logs kısmını boşaltıyoruz 
        const raw=localStorage.getItem(STORAGE_KEY);
        if(!raw) return;

        const data=JSON.parse(raw);
        data.logs= [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

        saveSeesawState();
    }

    //plank tıklaması->click event başlangıç noktası
    function onPlankClick(event) {
        const x=getClickOnPlank(event);
        const item=addRandomItem(x);
        const distance=Math.round(Math.abs(item.x-PIVOT));
        const side=item.x<PIVOT ? "left" : "right";
        
        //log formatı dökümanda verilen örnekten alındı
        appendLogLine(`📦 ${item.weight}kg dropped on ${side} side at ${distance}px from center`);

        updateSeesaw();
    }

    resetButton.addEventListener("click", resetPlank);
    clearLogButton.addEventListener("click", clearLogs);
    plankElement.addEventListener("click", onPlankClick);
    loadSeesawState();
})();
