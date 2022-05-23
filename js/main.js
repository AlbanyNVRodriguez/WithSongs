document.addEventListener("DOMContentLoaded", function (){
    // ClICKS
    document.addEventListener("click", e=>{
        // Navbar
        if(e.target.matches(".navbar .nav-theme")){
            theme(e);
        }
        // Logo
        if(e.target.matches(".navbar .nav-logo")){
            document.querySelector(".main").innerHTML = "";
        }
    });
    document.addEventListener("submit", e=>{
        e.preventDefault();
        search(e.target);
    })
});
// -----------------------------------
// SEARCH
async function search(form){
    let $main = document.querySelector(".main");
    $main.innerHTML = `<img class="loader" src="img/loader.svg" alt="loader">`;
    let artist = form.artist.value,
    song = form.song.value;
    let res = await validateForm(form);
    console.log(res)
    if(res !== undefined){
        let h2 = document.createElement("h2"),
        fragment = document.createDocumentFragment();
    
        h2.setAttribute("class", "main-result");
        h2.innerHTML = `Result for <br><span class="color-primary">${ toCapitalize(artist) } - ${ toCapitalize(song) }</span>`;
        fragment.appendChild(h2);
        renderLyric(fragment, res);
        
        $main.innerHTML = "";
        $main.append(fragment);
    }
}
// VALIDATE FORM
async function validateForm(form){
    if(form.artist.value == "") form.artist.placeholder = "Rellenar Campo";
    if(form.song.value == "") form.song.placeholder = "Rellenar Campo";
    if(form.artist.value !== "" && form.song.value !== ""){
        form.artist.placeholder = "Artist";
        form.song.placeholder = "Song";
        let res =  await getFetch({ artist: form.artist.value, song: form.song.value });
        form.artist.value = "";
        form.song.value = "";
        return res;
    }
}
// RENDER LYRIC
function renderLyric(fragment, res){
    let section = document.createElement("section");
    section.setAttribute("class", "main-section main-sectionSong");
    if(res.lyrics){
        section.innerHTML = `
            <p class="main_section-subtitle">Lyrics</p>
            <article class="main_section-article"><p> ${res.lyrics} </p></article>
        `;
    }else{
        section.innerHTML = `
            <p class="main_section-subtitle">Lyrics</p>
            <article class="main_section-article"><p> ;( </p></article>
        `;
    }
    fragment.appendChild(section);
}
// ------------------------------------
// GET FETCH
async function getFetch(opt){
    try {
        let {artist, song} = opt;
        let res = await fetch(`https://lyrics-plus.p.rapidapi.com/lyrics/${song}/${artist}`,{
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "lyrics-plus.p.rapidapi.com",
                "x-rapidapi-key": "51e998a7admshc9b0e2a36254105p1749f2jsnc72e37c6768b"
            }
        });
        if(!res.ok) throw { status: res.status, statusText: res.statusText, res };
        return res.json();
    } catch (error) {
        console.log(error);
    }
}
// ------------------------------------
// THEME
function theme(e){
    let navbarThemeBtn = document.querySelector(".navbar .nav-theme");
    if(navbarThemeBtn.className.includes("active")){
        navbarThemeBtn.classList.remove("active")
        document.querySelector("body").classList.remove("theme-light")
    }else{
        navbarThemeBtn.classList.add("active")
        document.querySelector("body").classList.add("theme-light")
    }
}
// ------------------------------------
// to capitalize
function toCapitalize(string){
    let array = string.split(" ");
    array.forEach( arr => {
        array[array.indexOf(arr)] = arr[0].toUpperCase() + arr.slice(1, arr.length).toLowerCase();
    });
    let text = array.toString();
    while(text.includes(",")){
        text = text.replace(","," ");
    }
    return text;
}