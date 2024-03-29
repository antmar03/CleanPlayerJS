/*
 * Copyright 2024 Anthony Marcellino
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class PlaybackSpeed {
    constructor(parent, video, config) {
        this.parent = parent;
        this.config = config;

        this.playbackSpeedHTML = `
            <div class = "settings-label">
                <label for = "playback-speed">Playback Speed</label>
            </div>
            <div class = "setting">
                <div class = "playback-speed">
                    <div class = "playback-speed-bar" style="height: ${this.config.playbackBarHeight};">
                        <div class = "playback-speed-progress"></div>
                    </div>
                    <div class = "playback-speed-info">
                        <span class = "playback-speed-value">1.0x</span>
                        <i class = "bi bi-arrow-clockwise playback-speed-reset"></i>
                    </div>
                </div>
            </div>
        `;
        
        this.parent.insertAdjacentHTML('beforeend', this.playbackSpeedHTML);

        this.playbackSpeedElement = this.parent.querySelector('.playback-speed');
        this.playbackSpeedBar = this.playbackSpeedElement.querySelector('.playback-speed-bar');
        this.playbackSpeedInfo = this.playbackSpeedElement.querySelector('.playback-speed-info');
        this.playbackSpeedValue = this.playbackSpeedElement.querySelector('.playback-speed-value');
        this.playbackSpeedReset = this.playbackSpeedElement.querySelector('.playback-speed-reset');

        this.video = video;
        this.config = config;
        this.playbackSpeed = 0.5;

        this.isDragging = false;

        this.playbackSpeedBar.addEventListener('mousedown', (e) => {            
            this.isDragging = true;
        });

        this.playbackSpeedBar.addEventListener('mouseup', (e) => {
            this.isDragging = false;
        });

        this.playbackSpeedReset.addEventListener('click', (e) => {
            this.setPlaybackSpeed(100);
        });

        document.addEventListener('mouseup', (e) => {
            this.isDragging = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const playbackSpeedElementOffsetLeft = this.playbackSpeedBar.getBoundingClientRect().left;
                const offsetXRelativeToPlaybackSpeedElement = e.clientX - playbackSpeedElementOffsetLeft;
                
                const playbackSpeed = Math.min(Math.max(offsetXRelativeToPlaybackSpeedElement / this.playbackSpeedBar.offsetWidth * 100, 0), 100);
                this.setPlaybackSpeed(playbackSpeed*2);
            }
        });

    }
    
    setPlaybackSpeed(playbackSpeed) {
        this.playbackSpeed = Math.max(0.1, playbackSpeed/100);
        this.playbackSpeedElement.querySelector('.playback-speed-progress').style.width = `${this.playbackSpeed*100/2}%`;

        this.video.playbackRate = this.playbackSpeed;
        

        this.playbackSpeedValue.innerHTML = `${(this.playbackSpeed).toFixed(1)}x`;
    }

    isDraggingTrue() {
        return this.isDragging;
    }
}

export default PlaybackSpeed;