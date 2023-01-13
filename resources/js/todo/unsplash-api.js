let getBackgroundImage = async () =>{
    let clientId = 'AeyH51IvuHqGF1X3g2gTTzTxbYvLVf7Gtok1VWF7h40';
    let url = 'https://api.unsplash.com/photos/random?'
    
    let params = {
        client_id:clientId,
        'orientation':'landscape',
        query:'landscape'
    }

    let res = await fetch(url+getQueryString(params));
    let imgData = res.json();
    return imgData;
}
let createUnsplashToken = async () => {
    let imgData = await getBackgroundImage();
    let imgURL = imgData.urls.regular;
    console.dir(imgData.location.name);
    let location = imgData.location.name?imgData.location.name:'with multicampus...';
    
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate()+1);
    
    let unSplashToken = {
        url:imgURL,
        'location':location,
        expiresOn:expirationDate.getTime()
    }
    
    localStorage.setItem('unSplashToken',JSON.stringify(unSplashToken));
    return unSplashToken;
}

let getUnsplashToken = async () => {
    
    let token = JSON.parse(localStorage.getItem('unSplashToken'));
    
    // token이 없거나 token이 만료되었으면 api호출을 통해 토큰을 생성
    let now = new Date().getTime();
    if(token && token.expiresOn > now) return token;
    
    // token이 있고 token이 만료되었으면 api호출을 통해 토큰을 생성
    return await createUnsplashToken();
}

(async () => {
    let unSplashToken = await getUnsplashToken();
    
    $('body').style.backgroundImage = `url(${unSplashToken.url})`;
    let bgSpan = createElement('span', {text:unSplashToken.location});
    $('.bg-location').append(bgSpan);

})();