export default class ScriptCache {
    constructor(scripts) {
      this.loaded = [];
      this.failed = [];
      this.pending = [];
      this.load(scripts)
    }
    
    loadSrc(src) {
        if (this.loaded.indexOf(src) >= 0) {
            return Promise.resolve(src);
        }
    
        this.pending.push(src);
        return this.scriptTag(src)
            .then(() => {
                // handle success
            })
            .catch(() => {
                // handle cleanup
            })
    }

    scriptTag(src, cb) {
        return new Promise((resolve, reject) => {
          let resolved = false,
              errored = false,
              body = document.getElementsByTagName('body')[0],
              tag = document.createElement('script');
    
          tag.type = 'text/javascript';
          tag.async = false; // Load in order
    
          const handleCallback = tag.onreadystatechange = function() {
            if (resolved) return handleLoad();
            if (errored) return handleReject();
            const state = tag.readyState;
            if (state === 'complete') {
              handleLoad()
            } else if (state === 'error') {
              handleReject()
            }
          }
    
          const handleLoad = (evt) => {resolved = true;resolve(src);}
          const handleReject = (evt) => {errored = true; reject(src) }
    
          tag.addEventListener('load', handleLoad)
          tag.addEventListener('error', handleReject);
          tag.src = src;
          body.appendChild(tag);
          return tag;
        });
    }
}