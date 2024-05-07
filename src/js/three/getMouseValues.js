function getMouseValues(params) {
	const { width, height, scene, camera, raycaster } = params || {};
	if (!params) {
		window.removeEventListener('pointermove', onMouseMove, false);
		return;
	}
	const state = {
		width: width || 0,
		height: height || 0,
		scene: scene || null,
		camera: camera || null,
		pointer: { x: 0, y: 0 },
		raycaster: raycaster,
		pointerSpeed: { x: 0, y: 0 },
	};

	function onMouseMove(event) {
		var now = Date.now();
		var currentmY = event.screenY;
		var currentmX = event.screenX;
		var currentmXY = event.screenX + event.screenY;

		var dtX = now - state.timestamp;
		var distanceX = Math.abs(currentmX - state.mX);
		var speedX = Math.round((distanceX / dtX) * 1000);
		state.mX = currentmX;
		state.pointerSpeed.x = speedX;

		var dtY = now - state.timestamp;
		var distanceY = Math.abs(currentmY - state.mY);
		var speedY = Math.round((distanceY / dtY) * 1000);
		state.mY = currentmY;
		state.pointerSpeed.y = speedY;

		var dtXY = now - state.timestamp;
		var distanceXY = Math.abs(currentmXY - state.mXY);
		var speedXY = Math.round((distanceXY / dtXY) * 1000);
		state.mXY = currentmY;

		state.timestamp = now;

		setTimeout(() => {
			state.pointerSpeed.x = 1.0;
			state.pointerSpeed.y = 1.0;
		}, 10);

		state.pointer.x = (event.clientX / state.width) * 2 - 1;
		state.pointer.y = -(event.clientY / state.height) * 2 + 1;

		state.raycaster.setFromCamera(state.pointer, state.camera);

		const intersects = state.raycaster.intersectObjects(state.scene.children);
		if (intersects.length > 0) {
			let obj = intersects[0].object;
			obj.material.uniforms.hover.value = intersects[0].uv;
			obj.material.uniforms.mouseSpeed.value = state.pointerSpeed;
			// console.log('obj.material.uniforms.hover.value', obj.material.uniforms.hover.value);
		}
	}

	window.removeEventListener('pointermove', onMouseMove, false);
	window.addEventListener('pointermove', onMouseMove, false);

	return state;
}

export default getMouseValues;
