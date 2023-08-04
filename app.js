import { months, categories } from "./constants.js";
import { renderMails, showModal, renderCategories } from "./ui.js";
// ! htmden gelenler
const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const closeMailBtn = document.querySelector("#close-btn")
const modal = document.querySelector(".modal-wrapper");
const form = document.querySelector("#create-mail-form")
const categoryArea = document.querySelector("nav .middle");
const searchButton = document.querySelector("#search-icon")
const searchInput = document.querySelector("#search-input")



// * localstorage dan veri alma
const strMailData = localStorage.getItem("data");
// * gelen steing veriyi obje ve dizilere çevirme
const mailData = JSON.parse(strMailData);


// ! olay izleyicileri
hamburgerMenu.addEventListener("click", handleMenu)


document.addEventListener("DOMContentLoaded", ()=> {

    renderCategories(categoryArea, categories, "Gelen kutusu");

    renderMails(mailsArea, mailData)
    if(window.innerWidth<1100){
        navigation.classList.add("hide")
    }
});

// pencerenin genişliğinin değişmesini izleme
window.addEventListener("resize", (e)=> {
const width =e.target.innerWidth;
if(width<1100){
    navigation.classList.add("hide")
}else{
    navigation.classList.remove("hide")
}
});

searchButton.addEventListener("click", searchMails)


//* modal işlemleri
createMailBtn.addEventListener("click",()=> showModal(modal,true));
closeMailBtn.addEventListener("click",()=> showModal(modal,false));
form.addEventListener("submit", sendMail);

mailsArea.addEventListener("click", updateMail)

// sidebar alanındaki tıklamalar
categoryArea.addEventListener("click", watchCategory);

// ! fonksiyonlar
//navigasyonu açıp kapamaya yarıyan fonksiyon
//hamburger menusüne tıklanınca çalışır
function handleMenu(){
    navigation.classList.toggle("hide")
}
// tarih oluşturan fonksiyon
function getDate(){
    // * tarih ayarları
    const dateArr = new Date().toLocaleDateString().split(".")
    const day = dateArr[0];
    const monthNumber = dateArr[1];
    const month = months[monthNumber - 1];
    
    return [day, month].join(' ');
}
//mail gönderme
function sendMail(e){
    e.preventDefault();
    
    const receiver = e.target[0].value;
    const title = e.target[1].value;
    const message = e.target[2].value;

    if(!receiver || !title || !message){
        // notification ver
        Toastify({
            text: "Lütfen formu doldurun!",
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            duration: 3000,
            style: {
                background: "rgb(193,193,0)",
                borderRadius: "4px",
            },
        }).showToast();

        // mail alanı alttaki kodların çalışmasını engelle
        return;
    }

    // * yeni mail oluşturma
    const newMail = {
        id: new Date().getTime(),
        sender: "Emre",
        receiver,
        title,
        message,
        stared: false,
        date: getDate(),
    };

    mailData.unshift(newMail);

    const strData = JSON.stringify(mailData);
    localStorage.setItem("data", strData);
    
    renderMails(mailsArea, mailData);
    showModal(modal, false)

    e.target[0].value = " ";
    e.target[1].value = " ";
    e.target[2].value = " ";

    // notification ver
    Toastify({
        text: "Mail başarıyla gönderildi!",
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        duration: 3000,
        style: {
            background: "#7CFC00",
            borderRadius: "4px",
            color: "white",
        },
    }).showToast();
}

// mail alanında bir tıklanma olunca çalışır
function updateMail(e){

    // güncellenecek maili belirleme
    const mail = e.target.parentElement.parentElement;

    // mailin dizideki yerini bulmak için idsine erişme
    const mailId = mail.dataset.id;
    //sil butonuna tıklanınca çalışır

    if(e.target.id === "delete"){
        
        // id değerini bildiğimiz elemanı diziden çıkarma
        const filtredData = mailData.filter((i)=> i.id != mailId)
        // diziyi string e çevirme
        const strData = JSON.stringify(filtredData)
        // localstorage gönderme
        localStorage.setItem("data",strData)
        //! maili htmldeb kaldırır
        mail.remove()
    }
    // yıldıza tıklanınca çalışır
    if(e.target.id === "star"){
        

        // idsinden yola çıkarak mail objesini bulma
        const foundItem =mailData.find((i)=> i.id == mailId)
        
        //bulduğumuz elemanın stared değerini tersine çevirme
        const updatedItem = {...foundItem, stared: !foundItem.stared};
        
        // güncellenecek elemanın dizideki sırasını bulma
        const index= mailData.findIndex((i)=> i.id == mailId)

        // dizideki elemanı günceleme
        mailData[index] = updatedItem;

        // localstorage gğncelleme
        localStorage.setItem("data", JSON.stringify(mailData))

        // html i güncelleme
        renderMails(mailsArea, mailData)
    }
}

// kategoryleri izleyip değiştireceğimiz fonksiyon

function watchCategory(e){
    const selectedCategory= e.target.dataset.name;
    // navigasyon alanını güncelleme
    renderCategories(categoryArea, categories, selectedCategory)

    if(selectedCategory === "Yıldızlı" ){
        // stared değeri true olanları seçme
        const filtred = mailData.filter((i)=> i.stared === true)
         
        // seçtiklerimizi ekrana basma
        renderMails(mailsArea, filtred);
        return;
    }

    // yıldız dışında bir category e tıklanırsa hepsini göster
    renderMails(mailsArea, mailData)
} 

// mail arama
function searchMails(){
    // arama terimini içeren mailleri alma
    const filtred= mailData.filter((i)=> 
    i.message.toLoverCase().includes(searchInput.value.toLoverCase()))

    // mailleri ekrana basma
    renderMails(mailsArea, filtred)
};






