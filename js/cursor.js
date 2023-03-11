export default function cursor() {
    //! Mouse animation
    class mouseFollow {
        constructor( classelem , classfollow , classinner ){
            this.elem = document.querySelector(classelem);
            this.elemOuter = document.querySelector(classfollow);
            this.elemInner = document.querySelector(classinner);
            this.init();
            this.event();
        }

        init() {
            let harlfWidth = { x: window.innerWidth >> 1 , y: window.innerHeight >> 1 }
            this.mousePos = {x:harlfWidth.x , y:harlfWidth.y }
            this.exmousePos = {x:harlfWidth.x , y:harlfWidth.y }
            this.move = { x:harlfWidth.x , y:harlfWidth.y  };
        }

        event(){
            //arrow関数を使わないとthisが変わる。
            window.addEventListener( 'mousemove' , (e) => {this.update(e);} , false) ;
            // window.addEventListener( 'mouseout' , (e) => {this.outmouse(e);} , false) ;
        }

        update(e){
            this.mousePos = { x: e.clientX , y: e.clientY };
        }

        outmouse(e){
            this.mousePos = {x: window.innerWidth >> 1 , y: window.innerHeight >> 1}
        }

        calcEasing (ex , current , easing) {
            return ex + ( current - ex ) * easing;
        }

        calc(){
            this.move.x = this.calcEasing( this.exmousePos.x , this.mousePos.x , 0.1  );
            this.move.y = this.calcEasing( this.exmousePos.y , this.mousePos.y , 0.1  );
            this.exmousePos.x = this.move.x;
            this.exmousePos.y = this.move.y;
            let distance = {
                x: Math.abs ( this.mousePos.x - this.exmousePos.x ) ,
                y: Math.abs ( this.mousePos.y - this.exmousePos.y ) ,
            }
            
            let distance_ = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
            
            let base_scale = Math.round( distance_ / (window.innerWidth / 6) * 100) / 100 + 1;
            base_scale = Math.min( base_scale , 1.5 );
            
            this.scale = {
                x: base_scale,
                y: 1 - Math.abs( 1 - base_scale )
            }
            
            if( Math.abs(  this.mousePos.x - this.move.x ) < 0.0005 ) { 
                this.move.x = this.mousePos.x;
                this.move.y = this.mousePos.y;
            }
            
            //rotation
            let distanceCircleToMouse = {
                x: Math.round( ( this.mousePos.x - this.move.x) * 100 ) / 100 ,
                y: Math.round( ( this.mousePos.y - this.move.y) * 100 ) / 100 
            }
            
            let radian = Math.atan2( distanceCircleToMouse.y , distanceCircleToMouse.x  );
            this.angle = ~~( radian * ( 180 / Math.PI ) );
            
        }

        follow(){
            this.calc();
            this.elemOuter.style.transform = `translate3d( ${this.move.x}px ,${this.move.y}px , 0 )`
            this.elemInner.style.transform = `rotate(${ this.angle }deg) scale(${ this.scale.x } , ${ this.scale.y })`;
        }
    }
  
    const calcEasing = (ex , current , easing) => {
        return ex + ( current - ex ) * easing;
    }
  
    const calcDis = (x, _x) => {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(_x, 2));
    }
  
    //atag
    let cursorAnimeOver = ()=>{
        let _p = document.querySelector('.curosr-inner svg');
        let _g = _p.querySelector('circle');
        gsap.to(_p , 0.5 , { scale: 2 })
        gsap.fromTo(_g , 0.6 , {drawSVG: "0 0"} , { drawSVG: "0 100%" })
    }
    let cursorAnimeOut = ()=>{
        let _p = document.querySelector('.curosr-inner svg');
        let _g = _p.querySelector('circle');
        gsap.to(_p , 0.5 , { scale: 1 })
    }
  
    let _a = document.querySelectorAll('a');
    _a.forEach(elem => {
        elem.addEventListener('mouseover' , cursorAnimeOver);
        elem.addEventListener('mouseout' , cursorAnimeOut);
    })
  
    document.addEventListener("DOMContentLoaded", function (event) {
        
        let iii = new mouseFollow('.cursor' ,  '.cursor-follow' ,  '.curosr-inner');

        const loop = ()=> {
            let animation = window.requestAnimationFrame(loop);
            iii.follow();
        }
        loop();
    });
}

cursor()