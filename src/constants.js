let w;
if (typeof global !== 'undefined') {
	w = global;
} else {
	w = window;
}

export const intersectionObserverSupport = 'IntersectionObserver' in w;
export const isIntersecting = (element) => element.isIntersecting || element.intersectionRatio > 0;
export const imageTransparent = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="