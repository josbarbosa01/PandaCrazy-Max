/** This class deals with any showing of modals for jobs.
 * @class ModalAlarmClass
 * @author JohnnyRS - johnnyrs@allbyjohn.com */
class ModalAlarmClass {
	constructor() {
    this.reader = new FileReader();
    this.audio = null;
  }
  /** Creates a Jquery button and returns it.
   * @param  {string} text   - Button Text @param  {string} [theClass] - Class Name @param  {string} [color] - Color Name @param  {string} [title] - Title
   * @param  {string} [size] - Button Size
   * @return {object}                 - The Jquery button element created. */
  btnStr(text, theClass='', status='', title='', size='xxs') {
    let titleStr = (title !== '') ? ` title='${title}'` : '';
    return `<button class='${theClass} btn btn-${size} ${status}'${titleStr}>${text}</button>`;
  }
  /** Creates the div element for each alarm option and returns it.
   * @param  {string} name - The name of the alarm to add.
   * @return {object}      - Jquery object of the div element created. */
  addDivAlarms(name) {
    let data = alarms.getData(name), statusM = (data.mute) ? 'btn-mutted' : '', colorT = (data.tts) ? 'pcm-toggledOn' : '', desc = data.desc, pay = data.pay;
    let lessThan = (data.lessThan) ? data.lessThan : '', payStr = (pay) ? ` <span class='pcm-alarmsPay' title='Change the less than pay rate.'>$${pay}</span>` : '';
    let lessThanStr = (lessThan > 0 && name !== 'queueAlert') ? ` with a short timer less than <span class='pcm-alarmsMinutes' title='Change the less than minute(s).'>${lessThan}</span> minute(s)` : '';
    if (name === 'queueAlert') lessThanStr = ` <span class='pcm-alarmsMinutes' title='Change the less than minute(s).'>${lessThan}</span> minute(s)`;
    return $(`<div class='${name}'></div>`).data('snd',name).append(this.btnStr('Play','pcm-playMe',_, 'Play the sound now!')).append(this.btnStr('Mute','pcm-muteMe', statusM, 'Mute this sound.')).append(this.btnStr('TTS','pcm-ttsMe', colorT, 'Use Text to Speech instead.')).append(this.btnStr('Change','pcm-newSnd',_, 'Change the alarm to your own sound file.')).append(`<span class='pcm-alarmDesc'>${desc}</span>${payStr}${lessThanStr}</div>`);
  }
  /** Add the save button when a user is changing the alarm sound.
   * @param  {string} name - The name of the alarm being changed. */
  addSaveButton(name) {
    $('.pcm-fileStatus').html('').removeClass('pcm-optionLabelError').append(this.btnStr('Save Audio', 'pcm-saveAudio', '', 'xs'));
    $('.saveAudio').click( () => {
      $('.pcm-changeMe').remove();
      if (this.audio) this.audio.load();
      alarms.getData(name).audio = this.audio; alarms.saveAlarm(name); this.audio = null;
    });
  }
  /** Shows the modal for the alrams so users can change alarm options.
   * @param  {function} [afterClose] - Function to call after modal is closed. */
  async showAlarmsModal(afterClose=null, onlySearch=false) {
    if (!modal) modal = new ModalClass();
    const idName = modal.prepareModal(this.alarms, '900px', 'pcm-alarmsModal', 'modal-lg', 'Alarm Options', '', '', '');
    const modalBody = $(`#${idName} .${modal.classModalBody}`);
    const divContainer = $(`<div class='pcm-alarms'></div>`);
    let df = document.createDocumentFragment();
    $(`<div class='pcm-alarmEdit'>You can mute and change an individual alarm sound here. Click the change button and pick your own sound from your computer. It must be less than 6MB and less than 30 seconds. You can also load in the default alarm sounds if you need to. The TTS button will have the script use a text to speech process instead of the alarm sound.</div>`).appendTo(df);
    if (onlySearch) { this.addDivAlarms('triggeredAlarm').appendTo(df); }
    else {
      this.addDivAlarms('less2').appendTo(df); this.addDivAlarms('less2Short').appendTo(df); this.addDivAlarms('less5').appendTo(df);
      this.addDivAlarms('less5Short').appendTo(df); this.addDivAlarms('less15').appendTo(df); this.addDivAlarms('less15Short').appendTo(df);
      this.addDivAlarms('more15').appendTo(df); this.addDivAlarms('queueFull').appendTo(df); this.addDivAlarms('queueAlert').appendTo(df);
      this.addDivAlarms('loggedOut').appendTo(df); this.addDivAlarms('captchaAlarm').appendTo(df);
    }
    modal.showModal(_, () => {
      $(`<div class='pcm-textToSpeechSelect'>Text to Speech voice: </div>`).append($(`<select id='voiceSelect'></select>`).append(alarms.voicesOption())).appendTo(df);
      divContainer.append(df).appendTo(modalBody);
      $('#voiceSelect').change( (e) => {
        let index = $('#voiceSelect option:selected').data('index');
        let name = $('#voiceSelect option:selected').data('name');
        alarms.theVoiceIndex(index); alarms.theVoiceName(name);
      });
      modalBody.find('.pcm-playMe').click( (e) => {
        let wasPlaying = $(e.target).hasClass('pcm-playing');
        modalBody.find('.pcm-playMe').removeClass('pcm-playing').blur();
        alarms.stopSound(); if (this.audio) this.audio.load();
        if (!wasPlaying) {
          $(e.target).addClass('pcm-playing');
          alarms.playSound($(e.target).closest('div').data('snd'), true,_, () => {
            modalBody.find('.pcm-playMe').removeClass('pcm-playing').blur();
          });
        }
      });
      modalBody.find('.pcm-muteMe').click( (e) => {
        let btn = $(e.target);
        let mute = alarms.muteToggle(btn.closest('div').data('snd'));
        if (mute) btn.addClass('btn-mutted'); else btn.removeClass('btn-mutted');
        btn.blur();
      });
      modalBody.find('.pcm-ttsMe').click( (e) => {
        let btn = $(e.target);
        let tts = alarms.ttsToggle(btn.closest('div').data('snd'));
        if (tts) btn.addClass('btn-doTTS'); else btn.removeClass('btn-doTTS');
        btn.blur();
      });
      modalBody.find('.pcm-newSnd').click( (e) => {
        modalBody.find('.pcm-playMe').removeClass('pcm-playing').blur();
        alarms.stopSound(); if (this.audio) this.audio.load();
        let prevSnd = $('.pcm-changeMe').data('snd'), btn = $(e.target);
        let soundName = btn.closest('div').data('snd');
        $('.pcm-changeMe').remove();
        if (prevSnd !== soundName) {
          btn.closest('div').after($(`<div class='pcm-changeMe'>Change sound to: </div>`).data('snd',soundName).append(`<span class='col-xs-12 pcm-fileInput'></span>`).append(createFileInput(_,'audio/*')).append($(`<span class='pcm-fileStatus'></span>`).append(this.btnStr('Default Audio', 'pcm-defaultAudio', '', 'xs'))));
          $('.custom-file-input').on('change', (e) => {
            const fileName = $(e.target).val().replace('C:\\fakepath\\', ''), theFile = $(e.target).prop('files')[0];
            if (theFile) {
              let error = '', size = theFile.size/1024/1024;
              if (this.audio) this.audio.load(); this.audio = null;
              if (!theFile.type.includes('audio')) error = 'Only audio files may be used for alarms.';
              if (size <= 0 || size >= 6) error = 'Size must be less than 6MB.';
              if (error === '') {
                $(e.target).next('.custom-file-label').addClass('selected').html(fileName);
                this.reader.onload = () => this.readData(soundName, theFile.type);
                this.reader.readAsBinaryString(theFile);
                this.reader.onerror = () => { $('.pcm-fileStatus').html('can not read the file').addClass('pcm-optionLabelError'); }
              } else $('.pcm-fileStatus').html(error).addClass('pcm-optionLabelError');
            }
          });
          $('.pcm-defaultAudio').click( (e) => {
            let data = alarms.getData(soundName);
            this.audio = new Audio();
            this.audio.src = chrome.runtime.getURL(`${alarms.getFolder()}/${data.filename}`);
            this.addSaveButton(soundName);
          });
        }
      });
      modalBody.find('.pay').click( (e) => {
        let soundName = $(e.target).closest('div').data('snd');
        modal.showDialogModal('700px', 'Change New Less Than Pay Rate.', 'Enter the pay rate this alarm will sound when the pay rate is less than this:', () => {
          let newValue = $('#pcm-formQuestion').val();
          if (!isNaN(newValue)) {
            newValue = Number(newValue).toFixed(2);
            if (newValue < 20) {
              alarms.setPayRate(soundName, newValue); $(e.target).html('$' + newValue); modal.closeModal();
            } else $('.pcm-inputDiv-question:first .inputError').html('Must be a decimal less than 20!');
          } else $('.pcm-inputDiv-question:first .inputError').html('Must be a number!');
        }, true, true, 'Pay rate: ', $(e.target).text().replace('$',''), 10,_, () => {}, 'Change', 'Default Value' ,() => {
          $(e.target).html('$' + alarms.setPayDef(soundName));
        });
      });
      modalBody.find('.minutes').click( (e) => {
        let soundName = $(e.target).closest('div').data('snd');
        modal.showDialogModal('700px', 'Change New Less Than Minutes.', 'Enter the minutes that this alarm will sound if the duration is less than this:', () => {
          let newValue = $('#pcm-formQuestion').val();
          if (!isNaN(newValue)) {
            alarms.setLessThan(soundName, newValue); $(e.target).html(newValue); modal.closeModal();
          } else $('.pcm-inputDiv-question:first .inputError').html('Must be a number!');
        }, true, true, 'Minutes: ', $(e.target).text(), 10,_, () => {}, 'Change', 'Default Value' ,() => {
          $(e.target).html(alarms.setLessThanDef(soundName));
        });
      });
    }, () => {
      if (this.audio) this.audio.load(); this.audio = null; alarms.stopSound();
      modal = null; if (afterClose) afterClose();
    });
  }
  /** Reads a file, sets up the audio and plays the audio to user.
   * @param  {string} name - Alarm Name @param  {string} type - Audio Type */
  readData(name, type) {
    let readerContents = this.reader.result;
    let base64Audio = btoa(readerContents);
    this.audio = new Audio(`data:${type};base64,` + base64Audio);
    this.audio.play(); this.addSaveButton(name);
  }
}