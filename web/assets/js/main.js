  const imageOptions = {
    pixelSize: 10,
    gap: 1,
    width: 40,
    height: 32,
    activeColor: 'red',
    inactiveColor: 'white'
  };
  const backend = {
    autoSaveMinInterval: 30,
    baseUrl: 'http://127.0.0.1:8080',
    frame: {
      get: (offset, limit, title) => `${backend.baseUrl}/frame?offset=${offset}&limit=${limit}&title=${title}`,
      create:(activate) => `${backend.baseUrl}/frame?activate=${activate}`,
      activate: (id) => `${backend.baseUrl}/frame/${id}/activate`,
      delete: (id) => `${backend.baseUrl}/frame/${id}`,
      update: (id) => `${backend.baseUrl}/frame/${id}`
    }
  }



  const editorCanvas = document.getElementById('editorCanvas');
  const brushSizeInput = document.getElementById('brushSize');
  const brightnessInput = document.getElementById('brightness');
  const colorPicker = document.getElementById('colorPicker');
  const editFrameName = document.getElementById('editorFrameName');
  const autoSaveCheckbox = document.getElementById('autoSave');
  const cardsSearch = document.getElementById('cardsSearchText');
  const itemsPerPage = document.getElementById('itemsPerPage');
  
  let isDrawing = false;
  let isEdited = true;
  let editorMode = 'new';
  let editorFrameId = null;
  let frames = {};
  let activeTool = 'brush';
  let lastSaveTime = 0;
  let waitingForSave = false;

function containsIgnoreCase(str1, str2) {
  return str2.toLowerCase().includes(str1.toLowerCase());
}

  function refreshGallery() {
    var limit = itemsPerPage.value;
    var offset = 0; // Assuming initial offset is 0
    fetch(backend.frame.get(offset, limit, cardsSearch.value))
            .then(response => response.json())
            .then(data => {
              var gallery = document.getElementById('gallery');
              gallery.innerHTML = '';
              frames = {};
              data.forEach(item => {
                frames[item.id] = item;
                var li = document.createElement('li');
                let card = document.getElementById('card-template').cloneNode(true);
                card.hidden = false;
                card.id = '';
                let title = card.getElementsByTagName('h5')[0];
                title.textContent = item.name;
                let description = card.getElementsByTagName('p')[0];
                description.textContent = item.description;
                let img = card.getElementsByTagName('img')[0];
                let imageBytes = base64ToBytes(item.pixelsBrightnesses);
                frames[item.id].pixelsBrightnesses = imageBytes;
                img.src = createSvgImage(imageBytes);
                let id = card.getElementsByTagName('input')[0];
                id.value = item.id;
                li.appendChild(card);
                gallery.appendChild(li);
                card.getElementsByClassName('playButton')[0].addEventListener('click', handlePlayButtonClick);
                card.getElementsByClassName('editButton')[0].addEventListener('click', handleEditButtonClick);
                card.getElementsByClassName('removeButton')[0].addEventListener('click', handleRemoveButtonClick);
              });
              // Привязываем обработчики событий к кнопкам

            })
            .catch(error => console.error('Error:', error));
  }

  function base64ToBytes(base64Strings) {
    return base64Strings.map(str => Uint8Array.from(atob(str), c => c.charCodeAt(0)));
  }

  function bytesToSvg(bytesArrays, options = {}) {
    const { pixelSize, gap, width, height, activeColor, inactiveColor } = imageOptions;
    const svgWidth = width * (pixelSize + gap) + gap;
    const svgHeight = height * (pixelSize + gap) + gap;
    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    for (let y = 0; y < bytesArrays.length; y++) {
      const row = bytesArrays[y];
      for (let x = 0; x < row.length; x++) {
        const color = row[x] ? activeColor : inactiveColor;
        const rectX = x * (pixelSize + gap) + gap;
        const rectY = y * (pixelSize + gap) + gap;
        svgContent += `<rect x="${rectX}" y="${rectY}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
      }
    }

    svgContent += `</svg>`;
    return svgContent;
  }


  function createSvgImage(bytesArrays) {
    const { width, height } = imageOptions;
    const svgImage = bytesToSvg(bytesArrays, { width, height });
    return 'data:image/svg+xml;base64,' + btoa(svgImage);
  }

  document.addEventListener('DOMContentLoaded', function () {
    refreshGallery();
    newImage();
  });

  itemsPerPage.addEventListener('input', refreshGallery);

  editorCanvas.addEventListener('mousedown', startDrawing);
  editorCanvas.addEventListener('mouseup', stopDrawing);
  editorCanvas.addEventListener('mousemove', draw);

  function startDrawing(event) {
    isDrawing = true;
    draw(event);
  }

  function stopDrawing() {
    isDrawing = false;
  }



  function getCoordsByEvent(event) {
    const rect = editorCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (imageOptions.pixelSize + imageOptions.gap));
    const y = Math.floor((event.clientY - rect.top) / (imageOptions.pixelSize + imageOptions.gap));
    return {x, y};
  }
  function draw(event) {
    if (!isDrawing) return;
    setIsEdited(true);
frameUpdateTrigger();
    const { width, height, inactiveColor } = imageOptions;
    var brushSize = parseInt(brushSizeInput.value);

    const color = colorPicker.value;
    const { x, y } = getCoordsByEvent(event);
    const coordinates = getDrawCoordinates(x, y, brushSize);
    coordinates.forEach(([i, j]) => {
      const pixelColor = i >= 0 && i < width && j >= 0 && j < height ? color : inactiveColor;
      drawPixel(i, j, pixelColor);
    });
  }

function frameUpdateTrigger(){
        if (autoSaveCheckbox.checked) {
      const currentTime = Date.now();
      if (currentTime - lastSaveTime > backend.autoSaveMinInterval) {
        saveImage();
        lastSaveTime = currentTime;
      } else {
        if (!waitingForSave) {
          waitingForSave = true;
          setTimeout(() => {
            saveImage();
            lastSaveTime = Date.now();
            waitingForSave = false;
          }, backend.autoSaveMinInterval);
        }
      }
    }
}

  function getPixelColor(x, y) {
    const { width, height, inactiveColor } = imageOptions;
    const pixelSize = imageOptions.pixelSize;

    if (x < 0 || x >= width || y < 0 || y >= height) {
      return inactiveColor; // Возвращаем цвет пикселя за пределами изображения
    }

    const context = editorCanvas.getContext('2d');
    const imageData = context.getImageData(x * (pixelSize + imageOptions.gap) + 1, y * (pixelSize + imageOptions.gap) + 1, pixelSize, pixelSize);

    const [r, g, b] = rgbaToRgb(imageData.data);

    return 255-g;
  }
  function rgbaToRgb(imageData) {
    const [rSource, gSource, bSource, aSource] = imageData;
    const alpha = aSource / 255;

    // Преобразуем RGBA в RGB, учитывая альфа-канал
    const r = Math.round((1 - alpha) * 255 + alpha * rSource);
    const g = Math.round((1 - alpha) * 255 + alpha * gSource);
    const b = Math.round((1 - alpha) * 255 + alpha * bSource);

    return [r, g, b];
  }



    function getPixelsBrightnesses() {
      const {width, height} = imageOptions;
      var pixelsArray = [];
      for (let i = 0; i < height; i++) {
        pixelsArray.push([]);
        for (let j = 0; j < width; j++) {
            const pixelColor = getPixelColor(j, i);
            pixelsArray[i].push(pixelColor);
        }
      }

      return pixelsArray;
    }

  function getDrawCoordinates(x, y, brushSize) {
    const coordinates = [];
    const leftOffset = Math.floor(brushSize / 2);
    const rightOffset = Math.ceil(brushSize / 2);
    for (let i = x - leftOffset; i <= x + Math.max(0, rightOffset); i++) {
      for (let j = y - leftOffset; j <= y + Math.max(0, rightOffset); j++) {
        if (i >= 0 && i < imageOptions.width && j >= 0 && j < imageOptions.height) {
          coordinates.push([i, j]);
        }
      }
    }
    return coordinates;
  }

  function setIsEdited(value) {
    isEdited = value;
    setSaveButtonState('Save', !value);
  }
  function setSaveButtonState(text, isDisabled) {
    const button = document.getElementById('saveButton');
    button.textContent = text;
    button.disabled = isDisabled;
  }
  function drawPixel(x, y, color) {
    const { pixelSize, gap } = imageOptions;
    const context = editorCanvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(x * (pixelSize + gap), y * (pixelSize + gap), pixelSize, pixelSize);
  }

  function bytesArrayToBase64(bytesArrays) {
    return bytesArrays.map(bytes => btoa(String.fromCharCode.apply(null, bytes)));
  }

  function newImage() {
    editorMode = 'new';
    editorFrameId = null;
    const previousBrightness = brightnessInput.value;
    for (let height = 0; height < imageOptions.height; height++) {
      for (let width = 0; width < imageOptions.width; width++) {
        setBrightness(0);
        drawPixel(width, height, colorPicker.value);
      }
    }
    setBrightness(previousBrightness);
    applyRandomFrameName();
  }

  function generateCurrentDateTime() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const month = months[now.getMonth()];
  const date = now.getDate();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${month} ${date}, ${hours}:${minutes}:${seconds}`;
}

  function saveImage() {
    setSaveButtonState('Saving', true);
    const pixelsBrightnesses = getPixelsBrightnesses();
    const base64Strings = bytesArrayToBase64(pixelsBrightnesses);
    const frameName = editFrameName.value;
    const data = {
      name: frameName,
      description: "Last modified "+generateCurrentDateTime(),
      pixelsBrightnesses: base64Strings
    };
    if (editorMode === 'edit') {
      fetch(backend.frame.update(editorFrameId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setSaveButtonState('Saved!', true);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при отправке данных');
      });
    } else {
      fetch(backend.frame.create(true), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
              .then(response => response.json())
              .then(data => {
                console.log('Success:', data);
                setSaveButtonState('Saved!', true);
                editorMode = 'edit';
                editorFrameId = data.frameId;
              })
              .catch(error => {
                console.error('Error:', error);
                alert('Ошибка при отправке данных');
              });
    }
  }

  function setBrightness(brightness) {
    brightnessInput.value = brightness;
    updateColorPicker();
  }

  brightnessInput.addEventListener('input', updateColorPicker);
editFrameName.addEventListener('input', frameNameUpdateEventListener);
cardsSearch.addEventListener('input', refreshGallery);




  function frameNameUpdateEventListener(){
      frameUpdateTrigger();
      setSaveButtonState('Save', false);
  }

  function updateColorPicker() {
    const brightness = parseInt(brightnessInput.value);
    if (brightness < 0 || brightness > 255 || isNaN(brightness)) {
      return;
    }
    const invertedHexBrightness = (255-brightness).toString(16).padStart(2, '0');
    const newColor = `#ff${invertedHexBrightness}${invertedHexBrightness}`;

    colorPicker.value = newColor;
  }



  document.addEventListener('keydown', function(event) {
    const key = event.code.toLowerCase().replace('digit', '');
    const buttonId = {
      'keyb': 'brushButton',
      'keyc': 'eraseButton',
      'keys': 'saveButton'
    }[key];
    if (buttonId) {
      document.getElementById(buttonId).click();
    } else if (key >= '1' && key <= '8') {
      document.getElementById('brushSize').value = parseInt(key)-1;
    }
  });

  // Функция для кнопки playButton
  function handlePlayButtonClick() {
    const id = getFrameIdFromButton(this);
    fetch(backend.frame.activate(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(data => {
      console.log('Playing:', data);

    })
  }

  function applyRandomFrameName(){
      editFrameName.value = generateName();
  }

  // Функция для кнопки editButton
  function handleEditButtonClick() {
    const id = getFrameIdFromButton(this);
    const frame = frames[id];
    if (!frame) {
      console.error('Frame not found');
      return;
    }
    drawBytesToCanvas(frame.pixelsBrightnesses);
    editorMode = 'edit';
    editorFrameId = id;
    editFrameName.value = frame.name;
  }

  function drawBytesToCanvas(bytesArrays) {
    const previousBrightness = brightnessInput.value;
    setBrightness(255);
    for (let y = 0; y < bytesArrays.length; y++) {
      const row = bytesArrays[y];
      for (let x = 0; x < row.length; x++) {
        const brightness = row[x];
        setBrightness(brightness);
        drawPixel(x, y, colorPicker.value);
      }
    }
    setBrightness(previousBrightness);
  }

  // Функция для кнопки removeButton
  function handleRemoveButtonClick() {
    if (confirm('Are you sure you want to delete this frame?')) {
      const id = getFrameIdFromButton(this);
      fetch(backend.frame.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
              .then(data => {
                console.log('Deleted:', data);
                refreshGallery();
              });
    }
  }

  function getFrameIdFromButton(button) {
    return button.parentElement.getElementsByTagName('input')[0].value;
  }

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
}

function generateName(){
	var name1 = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag","rocky"];

	var name2 = ["marriage","user","combination","failure","meaning","medicine","philosophy","teacher","communication","night","chemistry","disease","disk","energy","nation","road","role","soup","advertising","location","success","addition","apartment","education","math","moment","painting","politics","attention","decision","event","property","shopping","student","wood","competition","distribution","entertainment","office","population","president","unit","category","cigarette","context","introduction","opportunity","performance","driver","flight","length","magazine","newspaper","relationship","teaching","cell","dealer","debate","finding","lake","member","message","phone","scene","appearance","association","concept","customer","death","discussion","housing","inflation","insurance","mood","woman","advice","blood","effort","expression","importance","opinion","payment","reality","responsibility","situation","skill","statement","wealth","application","city","county","depth","estate","foundation","grandmother","heart","perspective","photo","recipe","studio","topic","collection","depression","imagination","passion","percentage","resource","setting","ad","agency","college","connection","criticism","debt","description","memory","patience","secretary","solution","administration","aspect","attitude","director","personality","psychology","recommendation","response","selection","storage","version","alcohol","argument","complaint","contract","emphasis","highway","loss","membership","possession","preparation","steak","union","agreement","cancer","currency","employment","engineering","entry","interaction","limit","mixture","preference","region","republic","seat","tradition","virus","actor","classroom","delivery","device","difficulty","drama","committee","conversation","database","enthusiasm","error","while","business","study","game","life","form","air","day","place","number","part","field","fish","back","process","heat","hand","experience","job","book","end","point","type","home","economy","value","body","market","guide","interest","state","radio","course","company","price","size","card","list","mind","trade","line","care","group","risk","word","fat","force","key","light","training","name","school","top","amount","level","order","practice","research","sense","service","piece","web","boss","sport","fun","house","page","term","test","answer","sound","focus","matter","kind","soil","board","oil","picture","access","garden","range","rate","reason","future","site","demand","exercise","image","case","cause","coast","action","age","bad","boat","record","result","section","building","mouse","cash","class","period","plan","store","tax","side","subject","space","rule","stock","weather","chance","figure","man","model","source","beginning","earth","program","chicken","design","feature","head","material","purpose","question","rock","salt","act","birth","car","dog","object","scale","sun","note","profit","rent","speed","style","war","bank","craft","half","voice","capital","challenge","friend","self","shot","brush","couple","exit","front","function","lack","living","plant","plastic","spot","summer","taste","theme","track","wing","brain","button","click","desire","foot","gas","influence","notice","rain","wall","base","damage","distance","feeling","pair","savings","staff","sugar","target","text","animal","author","budget","discount","file","ground","lesson","minute","officer","phase","reference","register","sky","stage","stick","title","trouble","bowl","bridge","campaign","character","club","edge","evidence","fan","letter","lock","maximum","novel","option","pack","park","quarter","skin","sort","weight","baby","background","carry","dish","factor","fruit","glass","joint","master","muscle","red","strength","traffic","trip","vegetable","appeal","chart","gear","ideal","kitchen","land","log","mother","net","party","principle","relative","sale","season","signal","spirit","street","tree","wave","belt","bench","commission","copy","drop","minimum","path","progress","project","sea","south","status","stuff","ticket","tour","angle","blue","breakfast","confidence","daughter","degree","doctor","dot","dream","duty","holiday","horror","horse","host","husband","loan","mistake","mountain","nail","noise","occasion","package","patient","pause","phrase","proof","race","relief","sand","sentence","shoulder","smoke","stomach","string","tourist","towel","vacation","west","wheel","wine","arm","aside","associate","bet","blow","border","branch","breast","brother","buddy","bunch","chip","coach","cross","document","draft","dust","expert","floor","god","golf","habit","iron","judge","knife","landscape","league","mail","mess","native","opening","parent","pattern","pin","pool","pound","request","salary"];

	var name = capFirst(name1[getRandomInt(0, name1.length + 1)]) + ' ' + capFirst(name2[getRandomInt(0, name2.length + 1)]);
	return name;

}

