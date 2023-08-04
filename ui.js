function trimString(str,max){
    if(str.lenght < max) return str;
    return str.slice(0, max) + "...";
}

//* ekrana verileri basacak fonksiyon 
export function renderMails(outlet,data){
    if(!data) return;
    
    outlet.innerHTML = data.map((mail)=>
    `
    <div class="mail" data-id=${mail.id}>
        <div class="left">
            <input type="checkbox">
            <i class="bi bi-star ${
                mail.stared && "star-active"
            }" id="star"></i>
            <span>${mail.receiver}</span>
        </div>
        <div class="right">
            <p class="message-title">${trimString(mail.title, 20)}</p>
            <p class="message-desc">${trimString(mail.message,40)}</p>
            <p class="message-date">${mail.date}</p>
            <button id="delete">Sil</button>
        </div>
    </div>
    `
    ).join(" ")

}

// * ekrana mail oluşturma penceresini açacak fonsiyon
export function showModal(modal,willOpen){
     modal.style.display = willOpen ? "grid" : "none";
}


// kategorileri ekrana basma metodu
export function renderCategories(outlet, data, selectedCategory){

    // eski kategoryleri sil
    outlet.innerHTML = "";

    // bize gelen diziyi dönme
    data.forEach((category) => {
        const categoryItem = document.createElement("a");

        // category elemanına veri ekleme
        categoryItem.dataset.name = category.title;
        // aktif olan category e active clası ekleme 
        categoryItem.className = 
            selectedCategory === category.title && "active-category";
        categoryItem.innerHTML = `
            <i class="${category.class}"></i>
            <span>${category.title}</span>
        `;
        outlet.appendChild(categoryItem);
    });
}



