import Draggable from './draggable';

export default class Comment {
    constructor(text, editor) {
        this.editor = editor;
        this.text = text;
        this.scale = 1;
        this.x = 0;
        this.y = 0;
        this.dragPosition = [0, 0];
        this.links = [];
        
        this.id = Comment.incrementId();
 
        this.el = document.createElement('div');
        this.el.tabIndex = 1;
        this.el.addEventListener('contextmenu', this.onClick.bind(this));
        this.el.addEventListener('focus', this.onFocus.bind(this));
        this.el.addEventListener('blur', this.onBlur.bind(this));
    
        new Draggable(this.el, () => this.onStart(), (dx, dy) => this.onTranslate(dx, dy));
        this.update();
    }
    
    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }

    linkTo(ids) {
        this.links = ids || [];
    }

    linkedTo(node) {
        return this.links.includes(node.id);
    }

    k() {
        return 1;
    }

    onClick(e) {
        e.preventDefault();
        e.stopPropagation();

        let newText = prompt('Comment', this.text);

        if (newText) {
            this.text = newText
            this.update();
        }
    }

    onFocus() {
        this.scale = Math.max(1, 1 / this.k());
        this.update();
        this.editor.trigger('commentselected', this)
    }

    focused() {
        return document.activeElement === this.el;
    }

    onBlur() {
        this.scale = 1;
        this.update()
    }

    blur() {
        this.el.blur();
    }

    onStart() {
        this.dragPosition = [this.x, this.y];
    }

    onTranslate (dx, dy) {
        const [x, y] = this.dragPosition;

        this.x = x + this.scale * dx;
        this.y = y + this.scale * dy;
        
        this.update();
    }

    update() {
        this.el.innerText = this.text;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    }

    toJSON() {
        return {
            text: this.text,
            position: [ this.x, this.y ],
            links: this.links
        }
    }
}
