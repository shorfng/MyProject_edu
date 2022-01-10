export function hasClass( elements: HTMLElement, cName: string ){
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );
}
export function addClass( elements: HTMLElement, cName: string ){
    if( !hasClass( elements, cName ) ){
        elements.className += " " + cName;
    };
}
export function removeClass( elements: HTMLElement, cName: string ){
    if( hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " );
    };
}