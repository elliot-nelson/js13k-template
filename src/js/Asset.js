const Asset = {
    images: {
        player: 'player.png'
    },
    data: {},

    async init() {
        await Promise.all(Object.keys(this.images).map(name => this.loadImageAsset(name)));
    },

    async loadImageAsset(name) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = this.images[name];
        }).then(img => this.data[name] = img);
    }
};
