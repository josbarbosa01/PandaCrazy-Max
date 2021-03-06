/** This class deals with any showing of modals for search triggers.
 * @class ModalSearchClass
 * @author JohnnyRS - johnnyrs@allbyjohn.com */
class ModalSearchClass {
	constructor() {
    this.pandaDur = {'min':0, 'max':3600};
    this.defaultPandaDur = {'min':5, 'max':3600};
    this.hamDur = {'min':0, 'max':120};
    this.fetchesDur = {'min':0, 'max':3600};
    this.pageSize = {'min':20, 'max':100};
    this.queueSize = {'min':20, 'max':200};
    this.triggerHistDays = {'min':2, 'max':60};
    this.customHistDays = {'min':2, 'max':30};
    this.autoRange = {'min':1, 'max':5};
  }
  /** Shows a modal for adding panda or search jobs.
   * @param  {function} [afterClose=null]  - Function to call after the modal is closed. */
  showTriggerAddModal(afterClose=null, doCustom=false) {
    if (!modal) modal = new ModalClass();
    const idName = modal.prepareModal(null, '920px', 'pcm-addTriggersModal', 'modal-lg', 'Add new Search Trigger', '<h4>Enter New Search Trigger Information.</h4>', 'pcm-searchModal', '', 'visible btn-sm', 'Add new Search Trigger', () => { checkTrigger(doCustom); }, 'invisible', 'No', null, 'visible btn-sm', 'Cancel');
    let df = document.createDocumentFragment(), div = null, input1Text = '* Enter info for new Job: ', searchOpt = globalOpt.doSearch();
    let example1Text = 'example: 3SHL2XNU5XNTJYNO5JDRKKP26VU0PY', example2Text = 'example: Ibotta receipts';
    if (doCustom) {
      div = $(`<div><div class='pcm-checkStatus pcm-inputError'></div><div class='pcm-modalInfo'>Enter a term or word to search for in titles and descriptions of a hit:</div></div>`).appendTo(df);
      input1Text = '* Enter custom search term: '; example1Text = 'example: survey'; example2Text = 'example: Surveys paying over $1.00';
    } else div = $(`<div><div class='pcm-checkStatus pcm-inputError'></div><div class='pcm-modalInfo'>Enter a Group ID, Requester ID, Preview URL or accept URL.</div></div>`).appendTo(df);
    createInput(df, ' pcm-inputDiv-url', 'pcm-formAddGroupID', input1Text, example1Text);
    createInput(df, ' pcm-inputDiv-name', 'pcm-formTriggerName', '* Name of the Trigger: ', example2Text);
    if (doCustom) createInput(df, ' pcm-inputDiv-pay', 'pcm-formMinPay', '* Pay Min Amount: ', 'example: 1.00');
    createCheckBox(df, 'Enabled: ', 'pcm-triggerEnabled', '', true);
    createCheckBox(df, 'Collect Only One Hit', 'pcm-onlyOnce', '');
    $(`<div class='pcm-horizontalRow'></div>`).appendTo(df);
    let data = {'reqName':'', 'hitTitle':'', 'price':0, 'limitNumQueue':0, 'limitTotalQueue':0, 'duration':(doCustom) ? searchOpt.defaultCustDur : searchOpt.defaultDur, 'limitFetches':(doCustom) ? searchOpt.defaultCustFetches : searchOpt.defaultFetches, 'autoGoHam':true, 'hamDuration':(doCustom) ? searchOpt.defaultCustHamDur : searchOpt.defaultHamDur, 'acceptLimit':0};
    if (!doCustom) {
      let table1 = $(`<table class='table table-dark table-hover table-sm pcm-detailsTable table-bordered pcm-topDetails'></table>`).append($(`<tbody></tbody>`)).appendTo(df);
      displayObjectData([
        {'label':'Requester Name:', 'type':'text', 'key':'reqName', 'tooltip':'The requester name for this job. May not be changed by user.'},
        {'label':'Hit Title:', 'type':'text', 'key':'hitTitle', 'tooltip':'The requester name for this job. May not be changed by user.'},
        {'label':'Pay Amount:', 'type':'text', 'key':'price', 'money':true, 'tooltip':'The payment reward for this job. May not be changed by user.'},
      ], table1, data, true);
    }
    $(`<div class='pcm-autoCollectOptions'>Panda hits auto collecting options (optional):</div>`).appendTo(df);
    let table2 = $(`<table class='table table-dark table-hover table-sm pcm-detailsTable table-bordered'></table>`).append($(`<tbody></tbody>`)).appendTo(df);
    displayObjectData([
      {'label':'Limit # of GroupID in queue:', 'type':'range', 'key':'limitNumQueue', 'tooltip':'Limit number of hits in queue by this group ID. Great way to do batches slowly.', 'minMax':{'min':0, 'max':24}},
      {'label':'Limit # of total Hits in queue:', 'type':'range', 'key':'limitTotalQueue', 'tooltip':'Limit number of hits allowed in queue. Good when you want to leave room in queue for better hits.', 'minMax':{'min':0, 'max':24}},
      {'label':'Stop Collecting After (seconds):', 'type':'number', 'key':'duration', 'seconds':true, 'default':data.duration, 'tooltip':'The number of seconds for this job to collect before stopping. Resets time if a hit gets collected.', 'minMax':this.pandaDur},
      {'label':'Stop Collecting After # of fetches:', 'type':'number', 'key':'limitFetches', 'default':data.limitFetches, 'tooltip':'Number of tries to catch a hit to do before stopping.', 'minMax':this.fetchesDur},
      {'label':'Force Delayed Ham on Collect:', 'type':'trueFalse', 'key':'autoGoHam', 'tooltip':'Should this job go ham when it finds a hit and then runs for delayed ham duration in milliseconds before it goes back to normal collecting mode?'},
      {'label':'Force Delayed Ham Duration (seconds):', 'type':'number', 'key':'hamDuration', 'seconds':true, 'default':data.hamDuration, 'tooltip':'The duration in seconds to use to go in ham mode after collecting a hit and then go back to normal collecting mode.', 'minMax':this.hamDur},
      {'label':'Daily Accepted Hit Limit:', 'type':'number', 'key':'acceptLimit', 'default':0, 'tooltip':'How many hits a day should be accepted for this job?'},
    ], table2, data, true);
    modal.showModal(null, () => {
      $(`#${idName} .${modal.classModalBody}`).append(df);
      $('#pcm-formAddGroupID').keypress( (e) => { if((e.keyCode ? e.keyCode : e.which) == '13') checkTrigger.call(this); });
      $('#pcm-triggerEnabled').click( e => $('#pcm-formAddGroupID').focus() );
      $('#pcm-onlyOnce').click( e => $('#pcm-formAddGroupID').focus() );
      $('#pcm-formAddGroupID').focus();
    }, () => { modal = null; if (afterClose) afterClose(); });
    function wrongInput(errorStr=null, theProblem=null) {
      if (theProblem) { $(`label`).removeClass(`pcm-inputError`); theProblem.addClass('pcm-inputError'); }
      $(div).find('.pcm-checkStatus.pcm-inputError:first').html((errorStr) ? errorStr : 'Must fill in GroupID, Requester ID or URL!').data('gIdEmpty',true);
    }
    /** Verifies that the groupID inputted is correct. */
    async function checkTrigger(doCustom) {
      let groupVal = $('#pcm-formAddGroupID').val(), trigName = $('#pcm-formTriggerName').val(), minPay = parseFloat($('#pcm-formMinPay').val());
      if (doCustom && groupVal.length <= 3) wrongInput('All custom Triggers MUST have a term to search for with more than 3 characters!', $(`label[for='pcm-formAddGroupID']`));
      else if (doCustom && trigName.length <= 3) wrongInput('You must fill in the Unique Trigger Name!', $(`label[for='pcm-formTriggerName']`));
      else if (doCustom && (isNaN(minPay) || minPay === 0)) wrongInput('All custom Triggers need to have a minimum pay rate!', $(`label[for='pcm-formMinPay']`));
      else if ((doCustom) || /(^http[s]{0,1}\:\/\/[^\s]*\/(projects|requesters)\/[^\s]*\/(tasks|projects)|^[Aa][^\s]{5,25}|^[^\s]{10,50})/.test(groupVal)) {
        let groupId = null, reqId = null;
        if (!doCustom) { if (groupVal.includes('://')) [groupId, reqId] = parsePandaUrl(groupVal); else if (groupVal.match(/^[^Aa]/)) groupId = groupVal; else { reqId = groupVal;} }
        if (!doCustom && !reqId && !groupId) wrongInput(_, $(`label[for='pcm-formAddGroupID']`));
        else {
          let type = (reqId) ? 'rid' : (groupId) ? 'gid' : 'custom', enabled = ($('#pcm-triggerEnabled').is(':checked') ? 'searching' : 'disabled');
          let theName = (trigName) ? trigName : (reqId) ? reqId : groupId;
          let theRules = (doCustom) ? {'terms':true, 'include':new Set([groupVal]), 'payRange': true, 'minPay':minPay} : {};
          let addSuccess = await bgSearch.addTrigger(type, {'name':theName, 'reqId':reqId, 'groupId':groupId, 'title':data.hitTitle, 'reqName':data.reqName, 'pay':data.price, 'status':enabled}, {'duration': data.duration, 'once':$('#pcm-onlyOnce').is(':checked'), 'limitNumQueue':data.limitNumQueue, 'limitTotalQueue':data.limitTotalQueue, 'limitFetches':data.limitFetches, 'autoGoHam':data.autoGoHam, 'tempGoHam':data.hamDuration, 'acceptLimit':data.acceptLimit}, theRules);
          if (addSuccess) { search.appendFragments(); modal.closeModal(); }
          else wrongInput('There is already a trigger with this value. Sorry. Please try again.', $(`label[for='pcm-formAddGroupID']`));
        }
      } else wrongInput(_, $(`label[for='pcm-formAddGroupID']`));
    }
  }
  async showDetailsModal(unique, afterClose=null) {
    if (!modal) modal = new ModalClass(); let dbId = bgSearch.uniqueToDbId(unique);
    let searchChanges = {'details':Object.assign({}, bgSearch.data[dbId]), 'rules':null, 'options':null, 'searchDbId':null};
    const idName = modal.prepareModal(searchChanges, '700px', 'pcm-triggerDetailsModal', 'modal-lg', 'Details for a Trigger', '', '', '', 'visible btn-sm', 'Save New Details', async (changes) => {
      $(`.pcm-eleLabel`).css('color', '');
      if (changes.details.type === 'custom' && changes.rules.include.size === 0) {
        $(`#${idName} .pcm-checkStatus.pcm-inputError`).html('Custom searches MUST have 1 Accepted term or word!');
        $(`#pcm-tdLabel-acceptWords1, #pcm-tdLabel-acceptWords2`).addClass('pcm-optionLabelError');
      } else {
        await bgSearch.optionsChanged(changes, changes.searchDbId);
        $(`#pcm-triggerName-${unique}`).html(changes.details.name);
        modal.closeModal();
      }
    }, 'invisible', 'No', null, 'visible btn-sm', 'Cancel');
    const modalBody = $(`#${idName} .${modal.classModalBody}`);
    let df = document.createDocumentFragment(), detailContents = null;
    detailContents = $(`<div class='pcm-detailCont card-deck'></div>`).appendTo(modalBody);
    this.triggerOptions(df, dbId, null, modal.tempObject[idName]);
    modal.showModal(null, () => {
      $(`<table class='table table-dark table-sm pcm-detailsTable table-bordered'></table>`).append($(`<tbody></tbody>`)).append(df).appendTo(detailContents);
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  rulesToStr(rules, placeHere=null) {
    let ruleStr = ''; for (const value of rules.values()) { ruleStr += `${value}, `; }
    if (ruleStr.length > 2) ruleStr = ruleStr.slice(0, -2);
    if (placeHere) placeHere.html((ruleStr) ? ruleStr: '{Empty}');
    return ruleStr;
  }
  selectBoxAdd(values, appendHere) {
    appendHere.html('');
    for (let i=0, len=values.length; i < len; i++) { appendHere.append(`<option value='${i}'>${values[i]}</option>`); }
  }
  editTriggerOptions(editSet, text, text2, validFunc, saveFunc, type, notEmpty=false) {
    if (!modal) modal = new ModalClass();
    let values = Array.from(editSet);
    const idName = modal.prepareModal(null, '640px', 'pcm-triggerEditModal', 'modal-lg', 'Edit Search Options', '', '', '', 'visible btn-sm', 'Done', saveFunc, 'invisible', 'No', null, 'invisible', 'Cancel');
    let df = document.createDocumentFragment();
    $(`<div><div class='pcm-checkStatus pcm-inputError'></div><div class='pcm-modalInfo'>Add a ${text} or remove others.</div></div>`).appendTo(df);
    if (type === 'custom') $(`<div class='small pcm-customRules'>All Custom Searches must have one 3 character Accepted term or word.<br>Adding more include or exclude words may cause script to find hits slower.</div>`).appendTo(df);
    let form = $(`<div class='form-group row'></div>`).appendTo(df);
    let selectBox = $(`<select class='form-control input-sm col-5' id='pcm-selectedBox' multiple size='10'></select>`).appendTo(form);
    this.selectBoxAdd(values, $(selectBox));
    $(`<button class='btn btn-xs pcm-addToSelect'>Add ${text2}</button>`).on( 'click', e => {
      modal.showDialogModal('750px', `Add New ${text}`, `Type in a ${text2}.`, () => {
        const newValue = $('#pcm-formQuestion').val(); $('.pcm-checkStatus.pcm-inputError').html('');
        if (newValue && validFunc(newValue)) {
          editSet.add(newValue); values = Array.from(editSet); this.selectBoxAdd(values, $(selectBox));
          $(`#pcm-tdLabel-acceptWords1, #pcm-tdLabel-acceptWords2`).removeClass('pcm-optionLabelError'); modal.closeModal();
        }
      }, true, false, `${text2}: `, ``, 35,_, () => {}, `Add ${text2}`,_,_,(text2 === 'Group ID') ? 'example: 3SHL2XNU5XNTJYNO5JDRKKP26VU0PY' : 'example: survey');
    }).appendTo(df);
    $(`<button class='btn btn-xs pcm-removeFromSelect'>Remove Selected</button>`).on( 'click', e => {
      let removeList = $(selectBox).val();
      if (type !== 'custom' || !notEmpty || (type === 'custom' && values.length > 0)) {
        for (const index of removeList) { editSet.delete(values[index]); }
        values = Array.from(editSet); this.selectBoxAdd(values, $(selectBox)); $('.pcm-checkStatus.pcm-inputError').html('');
      } else { $('.pcm-checkStatus.pcm-inputError').html('Must have 1 Accepted term or word in list!'); }
    }).appendTo(df);
    modal.showModal(null, () => {
      $(`#${idName} .${modal.classModalBody}`).append(df);
      $(`#${idName}`).keypress( (e) => {
        if((e.keyCode ? e.keyCode : e.which) == '13') saveFunc();
      });
    }, () => { });
  }
  /** Shows the options for search jobs and allows users to change or add rules.
   * @param  {object} appendHere - Jquery object @param  {number} dbId - The dbId of the panda job to be shown. */
  async triggerOptions(appendHere, dbId, pDbId, changes) {
    let bGStr = '', eTStr = '', iTStr = '', prependOpt = [], customOpt = []; changes.searchDbId = (dbId !== null) ? dbId : bgSearch.pandaToDbId(pDbId);
    $(`<div class='pcm-checkStatus pcm-inputError'></div><div class='pcm-detailsHeading'>Options: Click on the details or buttons to edit.</div>`).appendTo(appendHere);
    let theTable = $(`<table class='table table-dark table-sm pcm-detailsTable table-bordered'></table>`).appendTo(appendHere);
    if (!changes.details) {
      changes.details = Object.assign({}, bgSearch.getData(changes.searchDbId));
      if (typeof changes.details.disabled === 'undefined') changes.details.disabled = true;
      if (typeof changes.details.name === 'undefined') changes.details.name = changes.details.value;
    } else {
      prependOpt = [
        {'label':'Group or Requester ID', 'type':'text', 'key1':'details', 'key':'value', 'keyCheck':'type', 'keyCheckNot':'custom', 'disable':true, 'default':0, 'tooltip':'Value of this trigger'},
        {'label':'Unique Trigger Name:', 'type':'text', 'key1':'details', 'key':'name', 'tooltip':'The unique name for this trigger.'},
        {'label':'Disabled?:', 'type':'trueFalse', 'key1':'details', 'key':'disabled', 'tooltip':'Should trigger be disabled?'}
      ];
      if (changes.details.type === 'custom') customOpt = [
        {'label':'Automatic Collect Hits:', 'type':'trueFalse', 'key1':'options', 'key':'auto', 'tooltip':'Start collecting hits automatically up to limit.'},
        {'label':'Auto Collect Hits Limit:', 'type':'number', 'key1':'options', 'key':'autoLimit', 'tooltip':'Number of hits to collect at once automatically.', 'minMax':this.autoRange},
      ];
    }
    changes.rules = await bgSearch.rulesCopy(changes.searchDbId); changes.options = await bgSearch.optionsCopy(changes.searchDbId);
    bGStr = this.rulesToStr(changes.rules.blockGid); eTStr = this.rulesToStr(changes.rules.exclude); iTStr = this.rulesToStr(changes.rules.include);
    displayObjectData([
      ...prependOpt,
      {'label':'Minimum Pay:', 'type':'number', 'key':'minPay', 'key1':'rules', 'money':true, 'default':0, 'tooltip':'The minimum pay for hit to start collecting.'},
      {'label':'Maximum Pay:', 'type':'number', 'key':'maxPay', 'key1':'rules', 'money':true, 'default':0, 'tooltip':'The maximum pay for hit to start collecting.'},
      {'label':'Words or phrases Accepted only:', 'id':'pcm-string-include', 'type':'string', 'string':iTStr, 'key':'acceptWords1', 'disable':true, 'default':0, 'tooltip':'Hits with these words or phrases only will try to be collected.'},
      {'label':'Edit', 'type':'button', 'btnLabel':'Accepted Words or Phrases', 'addClass':' btn-xxs pcm-myPrimary', 'key':'acceptWords2', 'width':'165px', 'unique':1, 'btnFunc': (e) => {
        this.editTriggerOptions(changes.rules.include, 'Word or phrase to watch for', 'Word or phrase', () => { return true; }, () => {
          iTStr = this.rulesToStr(changes.rules.include, $('#pcm-string-include')); modal.closeModal();
        }, changes.details.type, true);
      }},
      {'label':'Excluded words or phrases:', 'id':'pcm-string-exclude', 'type':'string', 'string':eTStr, 'disable':true, 'default':0, 'tooltip':'Hits with these words or phrases will be ignored.'},
      {'label':'Edit', 'type':'button', 'btnLabel':'Excluded Words or Phrases', 'addClass':' btn-xxs pcm-myPrimary', 'idStart':'pcm-excludeWord-', 'width':'175px', 'unique':1, 'btnFunc': (e) => {
        this.editTriggerOptions(changes.rules.exclude, 'Word or phrase to exclude', 'Word or phrase', () => { return true; }, () => {
          eTStr = this.rulesToStr(changes.rules.exclude, $('#pcm-string-exclude')); modal.closeModal();
        }, changes.details.type);
      }},
      {'label':'Excluded Group IDs', 'id':'pcm-string-blockGid', 'type':'string', 'string':bGStr, 'disable':true, 'default':0, 'tooltip':'Hits with these group IDs will try to be collected only.'},
      {'label':'Edit', 'type':'button', 'btnLabel':'Excluded Group IDs', 'addClass':' btn-xxs pcm-myPrimary', 'idStart':'pcm-excludeGid-', 'width':'175px', 'unique':1, 'btnFunc': (e) => {
        this.editTriggerOptions(changes.rules.blockGid, 'Group ID to block', 'Group ID', (value) => { return value.match(/^[^Aa][0-9a-zA-Z]{15,35}$/); }, () => {
          bGStr = this.rulesToStr(changes.rules.blockGid, $('#pcm-string-blockGid')); modal.closeModal();
        }, changes.details.type);
      }},
      {'label':'Limit # of GroupID in queue:', 'type':'range', 'key1':'options', 'key':'limitNumQueue', 'tooltip':'Limit number of hits in queue by this group ID. Great way to do batches slowly.', 'minMax':{'min':0, 'max':24}},
      {'label':'Limit # of total Hits in queue:', 'type':'range', 'key1':'options', 'key':'limitTotalQueue', 'tooltip':'Limit number of hits allowed in queue. Good when you want to leave room in queue for better hits.', 'minMax':{'min':0, 'max':24}},
      ...customOpt,
      {'label':'Accept Only Once:', 'type':'trueFalse', 'key1':'options', 'key':'once', 'tooltip':'Should only one hit be accepted and then stop collecting? Great for surveys.'},
      {'label':'Daily Accepted Hit Limit:', 'type':'number', 'key1':'options', 'key':'acceptLimit', 'default':0, 'tooltip':'How many hits a day should be accepted for this job?'},
      {'label':'Stop Collecting After (seconds):', 'type':'number', 'key1':'options', 'key':'duration', 'seconds':true, 'default':0, 'tooltip':'The number of seconds for hits found to collect before stopping. Resets time if a hit gets collected.', 'minMax':this.pandaDur},
      {'label':'Stop Collecting After # of fetches:', 'type':'number', 'key1':'options', 'key':'limitFetches', 'default':0, 'tooltip':'Number of tries to catch a hit to do before stopping.', 'minMax':this.fetchesDur},
      {'label':'Force Delayed Ham on Collect:', 'type':'trueFalse', 'key1':'options', 'key':'autoGoHam', 'tooltip':'Should this job go ham when it finds a hit and then runs for delayed ham duration in milliseconds before it goes back to normal collecting mode?'},
      {'label':'Temporary Start Ham Duration (seconds):', 'type':'number', 'key1':'options', 'key':'tempGoHam', 'seconds':true, 'default':0, 'tooltip':'The duration in seconds to use to go in ham mode after starting to collect a hit and then go back to normal collecting mode.', 'minMax':this.hamDur},
    ], theTable, changes, true);
  }
  async showTriggerFound(unique, afterClose=null) {
    if (!modal) modal = new ModalClass(); let dbId = bgSearch.uniqueToDbId(unique);
    const idName = modal.prepareModal(null, '860px', 'pcm-triggerFoundModal', 'modal-lg', 'Show triggers found by Trigger.', '', 'pcm-modalHitsFound', '', 'visible btn-sm', 'Done', () => { modal.closeModal(); }, 'invisible', 'No', null, 'invisible', 'Cancel');
    let df = document.createDocumentFragment();
    modal.showModal(null, async () => {
      let groupHist = await bgSearch.getFromDB('history', dbId, 'dbId', true, false, 80), rules = await bgSearch.theData(dbId, 'rules');
      let gidsValues = [], gidsData = {}, blocked = rules.blockGid;
      arrayCount(groupHist, (value) => { gidsValues.push(value.gid); gidsData[value.gid] = value; return true; }, true);
      let gidsHistory = await bgHistory.findValues(gidsValues);
      let theTable = $(`<table class='table table-dark table-sm pcm-detailsTable table-moreCondensed table-bordered'></table>`)
        .append(`<thead><tr><td style='width:75px; max-width:75px;'>date</td><td style='width:82px; max-width:82px;'>Gid</td><td style='width:120px; max-width:120px;'>Title</td><td style='width:440px; max-width:440px'>Descriptions</td><td style='width:52px; max-width:52px;'>Pays</td><td style='width: 70px; max-width:70px;'></td></tr></thead>`).append(`<tbody></tbody>`).appendTo(df);
      for (const key of gidsValues) {
        let dateString = '----', title = '----', description = '----', pays = '----';
        let theDate = new Date(gidsData[key].date); dateString = theDate.toLocaleDateString('en-US', {'month':'short', 'day':'2-digit'}).replace(' ','');
        dateString += ' ' + theDate.toLocaleTimeString('en-GB', {'hour':'2-digit', 'minute':'2-digit'});
        if (gidsHistory[key]) {
          if (checkString(gidsHistory[key].pay)) gidsHistory[key].pay = parseFloat(gidsHistory[key].pay);
          title = gidsHistory[key].title; description = gidsHistory[key].description; pays = gidsHistory[key].pay.toFixed(2);
        }
        let tempObj = {'date':dateString,'gid':shortenGroupId(key, 4, 4), 'title':title, 'desc':description, 'pays':'$' + pays};
        let btnLabel = (blocked.has(key)) ? 'Unblock' : 'Block Hit', statusClass = (blocked.has(key)) ? ' pcm-hitBlocked' : '';
        displayObjectData([
          {'type':'keyValue', 'key':'date', 'maxWidth':'75px'}, {'type':'keyValue', 'key':'gid', 'maxWidth':'82px'},
          {'type':'keyValue', 'key':'title', 'maxWidth':'120px'}, {'type':'keyValue', 'key':'desc', 'maxWidth':'440px'}, {'type':'keyValue', 'key':'pays', 'maxWidth':'52px'},
          {'label':'block', 'type':'button', 'btnLabel':btnLabel, 'addClass':` btn-xxs${statusClass}`, 'maxWidth':'70px', 'btnFunc': (e) => {
            if (blocked.has(key)) { blocked.delete(key); $(e.target).removeClass(`pcm-hitBlocked`).html('Block Hit'); }
            else { blocked.add(key); $(e.target).addClass(`pcm-hitBlocked`).html('Unblock'); }
            rules.blockGid = blocked; bgSearch.theData(dbId, 'rules', rules)
          }, 'idStart': 'pcm-blockThis', 'unique': key}
        ], theTable.find(`tbody`), tempObj, true, true, true, 'pcm-modalTriggeredhit');
      }
      $(`#${idName} .${modal.classModalBody}`).append(df);
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  showSearchOptions(afterClose=null) {
    if (!modal) modal = new ModalClass();
    let theData = {'toSearchUI':globalOpt.theToSearchUI(), 'searchTimer':globalOpt.theSearchTimer(), 'options':globalOpt.doSearch()}
    const idName = modal.prepareModal(theData, '860px', 'pcm-triggerOptModal', 'modal-lg', 'Edit Search General Options', '', 'm-0 p-1', '', 'visible btn-sm', 'Save Options', (changes) => {
      globalOpt.theToSearchUI(changes.toSearchUI, false); globalOpt.theSearchTimer(changes.searchTimer, false);
      globalOpt.doSearch(changes.options); bgSearch.timerChange(changes.searchTimer);
      modal.closeModal();
    }, 'invisible', 'No', null, 'invisible', 'Cancel');
    let df = document.createDocumentFragment();
    $(`<div class='pcm-detailsEdit'>Click on the options you would like to change below:</div>`).appendTo(df);
    displayObjectData( [
      {'label':'Search job buttons create search UI triggers:', 'type':'trueFalse', 'key':'toSearchUI', 'tooltip':'Using search buttons creates search triggers in the search UI instead of panda UI.'}, 
      {'label':'Search Timer:', 'type':'number', 'key':'searchTimer', 'tooltip':`Change the search timer duration for hits to be searched and found in milliseconds.`, 'minMax':globalOpt.getTimerSearch()},
      {'label':'Default trigger duration (seconds):', 'seconds':true, 'type':'number', 'key1':'options', 'key':'defaultDur', 'tooltip':`The default duration for new triggers to use on panda jobs.`, 'minMax':this.defaultPandaDur},
      {'label':'Default trigger ham duration (seconds):', 'seconds':true, 'type':'number', 'key1':'options', 'key':'defaultHamDur', 'tooltip':`The default ham duration for new triggers to use on panda jobs.`, 'minMax':this.hamDur},
      {'label':'Default trigger limit fetches:', 'type':'number', 'key1':'options', 'key':'defaultFetches', 'tooltip':`The default number of fetches for new triggers to use on panda jobs.`, 'minMax':this.fetchesDur},
      {'label':'Default custom duration (seconds):', 'seconds':true, 'type':'number', 'key1':'options', 'key':'defaultCustDur', 'tooltip':`The default duration for new custom triggers to use on panda jobs.`, 'minMax':this.pandaDur},
      {'label':'Default custom ham duration (seconds):', 'seconds':true, 'type':'number', 'key1':'options', 'key':'defaultCustHamDur', 'tooltip':`The default ham duration for new custom triggers to use on panda jobs.`, 'minMax':this.hamDur},
      {'label':'Default custom limit fetches:', 'type':'number', 'key1':'options', 'key':'defaultCustFetches', 'tooltip':`The default number of fetches for new custom triggers to use on panda jobs.`, 'minMax':this.fetchesDur},
      {'label':'Page size for mturk search page:', 'type':'number', 'key1':'options', 'key':'pageSize', 'tooltip':`Number of hits used on mturk first search page. The higher the number can slow searching but also can give a better chance of finding hits you want.`, 'minMax':this.pageSize},
    ], df, modal.tempObject[idName], true);
    modal.showModal(() => {}, async () => {
      const modalBody = $(`#${idName} .${modal.classModalBody}`);
      $(`<table class='table table-dark table-hover table-sm pcm-detailsTable table-bordered'></table>`).append($(`<tbody></tbody>`).append(df)).appendTo(modalBody);
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  showSearchAdvanced(afterClose=null) {
    if (!modal) modal = new ModalClass();
    const idName = modal.prepareModal(globalOpt.doSearch(), '860px', 'pcm-advancedOptModal', 'modal-lg', 'Edit Search Advanced Options', '', 'm-0 p-1', '', 'visible btn-sm', 'Save Options', (changes) => {
      globalOpt.doSearch(changes); modal.closeModal();
    }, 'invisible', 'No', null, 'invisible', 'Cancel');
    let df = document.createDocumentFragment();
    $(`<div class='pcm-detailsEdit'>Click on the options you would like to change below:</div>`).appendTo(df);
    displayObjectData( [
      {'label':'Number of trigger data to keep in memory:', 'type':'number', 'key':'queueSize', 'tooltip':`To save memory the script will only keep this number of most active trigger data in memory and the rest in the database. Loading from database can be slower.`, 'minMax':this.queueSize},
      {'label':'Trigger hits history days expiriration:', 'type':'number', 'key':'triggerHistDays', 'tooltip':`Hits found by trigger is saved in the database and this number represents the days to keep those hits saved.`, 'minMax':this.triggerHistDays},
      {'label':'Custom hits history days expiration:', 'type':'number', 'key':'customHistDays', 'tooltip':`Custom triggered hits can find a large amount of hits so this number represents how many days to save these found hits. Should be lower than regular triggers.`, 'minMax':this.customHistDays},
    ], df, modal.tempObject[idName], true);
    modal.showModal(() => {}, async () => {
      const modalBody = $(`#${idName} .${modal.classModalBody}`);
      $(`<table class='table table-dark table-hover table-sm pcm-detailsTable table-bordered'></table>`).append($(`<tbody></tbody>`).append(df)).appendTo(modalBody);
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  showSearchBlocked(afterClose=null) {
    if (!modal) modal = new ModalClass();
    const idName = modal.prepareModal(globalOpt.doSearch(), '860px', 'pcm-blockedModal', 'modal-lg', `Edit Blocked Group and Requester ID's`, '', 'm-0 p-1', '', 'visible btn-sm', 'Done', () => { modal.closeModal(); }, 'invisible', 'No', null, 'invisible', 'Cancel');
    modal.showModal(() => {}, async () => {
      let df = document.createDocumentFragment(), df2 = document.createDocumentFragment(), modalBody = $(`#${idName} .${modal.classModalBody}`);
      let blockingDiv = $(`<div id='pcm-blockDetails'></div>`).appendTo(modalBody), gidContents = null, ridContents = null;
      let blockTabs = new TabbedClass(blockingDiv, `pcm-blockingTabs`, `pcm-gidBlock`, `pcm-ridBlock`, false, 'Block');
      let [_, err] = await blockTabs.prepare(), gidvals = bgSearch.getBlocked(), ridvals = bgSearch.getBlocked(false);
      if (!err) {
        function statusInput(tab, resultStr=null, error=true) {
          let theClass = (error) ? 'pcm-optionLabelError' : 'pcm-statusSuccess';
          modalBody.find(`.${tab} .pcm-inputResult:first`).removeClass('pcm-optionLabelError pcm-statusSuccess').addClass(theClass).html(resultStr);
        }
        async function checkInput(e, remove, thisClass=null) {
          let thisTab = $(e.target).data('tab'), gid = null, rid = null, theResult = null, groupId = $(e.target).data('gid');
          let value = modalBody.find(`.${thisTab} input`).val();
          if (!value) { statusInput(thisTab, 'Enter in an ID in the input below.'); return; }
          else if (groupId && value.match(/^3[0-9a-zA-Z]{14,38}$/)) gid = value; else if (!groupId && value.match(/^[Aa][0-9a-zA-Z]{6,25}$/)) rid = value;
          if (gid || rid) {
            theResult = bgSearch.theBlocked(gid, rid, !remove, remove);
            if (theResult[(groupId) ? 0 : 1]) {
              statusInput(thisTab, `SUCCESS: ID ${(remove) ? 'Removed from' : 'added to'} blocked hits.`, false);
              if (!remove) {
                let valInfo = await bgHistory.findValues((groupId) ? [gid] : [rid]);
                if (groupId) gidvals.push(gid + ((valInfo[gid]) ? ` - ${valInfo[gid].title}` : ` -`));
                else ridvals.push(rid + ((valInfo[rid]) ? ` - ${valInfo[rid].reqName}` : ` -`));
              }
              else if (groupId) gidvals = gidvals.filter( (item) => !item.includes(gid) );
              else ridvals = ridvals.filter((item) => !item.includes(rid));
              thisClass.selectBoxAdd((groupId) ? gidvals : ridvals, modalBody.find(`.${thisTab} select`));
              modalBody.find(`.${thisTab} input`).val('');
            }
            else statusInput(thisTab, `ERROR: ID ${(remove) ? 'not being blocked so removal failed' : 'is already being blocked'}.`);
          } else statusInput(thisTab, `Not a valid ID. Please enter in the ${(groupId) ? 'Group ID' : 'Requester ID'} again.`);
        }
        let gidTab = await blockTabs.addTab(`Group ID Blocked`, true);
        gidContents = $(`<div class='pcm-gidCont'></div>`).appendTo(`#${gidTab.tabContent}`);
        let ridTab = await blockTabs.addTab(`Requester ID Blocked`);
        ridContents = $(`<div class='pcm-ridCont'></div>`).appendTo(`#${ridTab.tabContent}`);
        let exampleGid = 'example: 3SHL2XNU5XNTJYNO5JDRKKP26VU0PY', exampleRid = 'example: AGVV5AWLJY7H2';
        let typeGid = true, thisTab = 'pcm-gidCont', thisFrag = df, typeExample = exampleGid;
        let gidsHistory = await bgHistory.findValues(gidvals), ridsHistory = await bgHistory.findValues(ridvals), values = gidvals; 
        for (let j=0, len=gidvals.length; j < len; j++) { gidvals[j] += (gidsHistory[gidvals[j]]) ? ` - ${gidsHistory[gidvals[j]].title}` : ` -`; }
        for (let j=0, len=ridvals.length; j < len; j++) { ridvals[j] += (ridsHistory[ridvals[j]]) ? ` - ${ridsHistory[ridvals[j]].reqName}` : ` -`; }
        for (let i=0; i < 2; i++) {
          $(`<div><div class='pcm-inputResult'>&nbsp;</div><div style='color:aqua'>Enter an ID to add or remove from being blocked.</div></div>`).appendTo(thisFrag);
          createInput(thisFrag, ' pcm-inputDiv-url', 'pcm-formAddTheID', `Enter in ${(typeGid) ? 'Group' : 'Requester'} ID:`, typeExample,_,_,'',90);
          $(`<button class='btn btn-xs pcm-addBlocked'>Add ID</button>`).data('tab',thisTab).data('gid',typeGid)
            .on('click', (e) => { checkInput(e, false, this); }).appendTo(thisFrag);
          $(`<button class='btn btn-xs pcm-removeBlocked'>Remove ID</button>`).data('tab',thisTab).data('gid',typeGid)
            .on('click', (e) => { checkInput(e, true, this); }).appendTo(thisFrag);
          let form = $(`<div class='form-group pcm-inputBoxForm'></div>`).appendTo(thisFrag);
          let selectBox = $(`<select class='form-control input-sm col-8' id='pcm-selectedBox' multiple size='12'></select>`).appendTo(form);
          this.selectBoxAdd(values, $(selectBox));
          $(`<button class='btn btn-xs btn-primary pcm-removeFromSelect'>Remove selected ID</button>`).data('tab',thisTab).data('gid',typeGid).on( 'click', (e) => {
            let thisTab = $(e.target).data('tab'), selected = modalBody.find(`.${thisTab} option:selected`), isgid = $(e.target).data('gid');
            let valArray = (isgid) ? gidvals : ridvals, gid = null, rid = null;
            if (selected.length) {
              for (const ele of selected) {
                let text = $(ele).text(), value = text.split(' ')[0]; if (isgid) gid = value; else rid = value; let theResult = bgSearch.theBlocked(gid, rid, false, true);
                if (theResult[(isgid) ? 0 : 1]) valArray = arrayRemove(valArray, text);
              }
              this.selectBoxAdd(valArray, modalBody.find(`.${thisTab} select`));
            }
            if (isgid) gidvals = valArray; else ridvals = valArray;
          }).appendTo(thisFrag);
          typeGid = false, thisTab = 'pcm-ridCont', thisFrag = df2, typeExample = exampleRid, values = ridvals;
        }
        gidContents.append(df); ridContents.append(df2);
      }
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  showTriggeredHit(theData, afterClose=null, ele=null) {
    if (!modal) modal = new ModalClass();
    const idName = modal.prepareModal(globalOpt.doSearch(), '860px', 'pcm-triggeredHitModal', 'modal-lg', 'Triggered Hit Details', '', '', '', 'visible btn-sm', 'Done', () => {
      let check = bgSearch.theBlocked(theData.gid, theData.rid), tr = $(ele.target).closest('tr');
      if (ele && (check[0] || check[1])) tr.addClass('pcm-blockedHit'); else tr.removeClass('pcm-blockedHit');
      modal.closeModal();
    }, 'invisible', 'No', null, 'invisible', 'Cancel');
    modal.showModal(() => {}, async () => {
      let df = document.createDocumentFragment(), blocked = bgSearch.theBlocked(theData.gid, theData.rid);
      $(`<div class='pcm-detailsEdit'>Details of this hit:</div>`).appendTo(df);
      displayObjectData( [
        {'label':'Requester Name:', 'type':'keyValue', 'key':'requester_name', 'disable':true, 'tooltip':`Requester Name for this hit.`},
        {'label':'Title:', 'type':'keyValue', 'key':'title', 'disable':true, 'tooltip':`Title of this hit.`},
        {'label':'Description:', 'type':'keyValue', 'key':'description', 'disable':true, 'tooltip':`Description of this hit.`},
        {'label':'Price:', 'type':'number', 'key1':'monetary_reward', 'key':'amount_in_dollars', 'money':true, 'disable':true, 'tooltip':`Price for this hit.`},
        {'label':'Requester ID:', 'type':'keyValue', 'key':'requester_id', 'disable':true, 'tooltip':`Requester ID for this hit.`},
        {'label':'Group ID:', 'type':'keyValue', 'key':'hit_set_id', 'disable':true, 'tooltip':`Group ID for this hit.`},
      ], df, theData, true);
      $(`<div class='pcm-buttonArea'></div>`).append($(`<button class='btn btn-xs pcm-blockGid'>${(blocked[0]) ? 'UNBLOCK' : 'Block'} this Group ID</button>`).click( (e) => {
          bgSearch.theBlocked(theData.gid, null, true, false, true); let check = bgSearch.theBlocked(theData.gid, null);
          $(e.target).text(`${(check[0]) ? 'UNBLOCK' : 'Block'} this Group ID`);
        })).append($(`<button class='btn btn-xs pcm-blockRid'>${(blocked[1]) ? 'UNBLOCK' : 'Block'} this Requester</button>`).click( (e) => {
          bgSearch.theBlocked(null, theData.rid, true, false, true); let check = bgSearch.theBlocked(null, theData.rid);
          $(e.target).text(`${(check[1]) ? 'UNBLOCK' : 'Block'} this Requester`);
        })).appendTo(df);
        const modalBody = $(`#${idName} .${modal.classModalBody}`);
        $(`<table class='table table-dark table-hover table-sm pcm-detailsTable table-bordered'></table>`).append($(`<tbody></tbody>`).append(df)).appendTo(modalBody);
    }, () => { modal = null; if (afterClose) afterClose(); });
  }
  async showTriggersTable(modalBody, triggers, checkboxFunc=null, afterClose=null) {
    const divContainer = $(`<table class='table table-dark table-sm table-moreCondensed pcm-jobTable table-bordered w-auto'></table>`).append($(`<tbody></tbody>`)).appendTo(modalBody);
    displayObjectData([
      {'string':'', 'type':'checkbox', 'btnFunc': (e) => { $(`.modal-body input[type='checkbox']`).prop('checked', $(e.target).is(':checked')); }},
      {'string':'Type', 'type':'string', 'noBorder':true}, {'string':'Trigger Name', 'type':'string', 'noBorder':true}, {'string':'Trigger ID or Term', 'type':'string', 'noBorder':true},
      {'string':'Status', 'type':'string'}
    ], divContainer, {}, true, true, true, 'pcm-triggeredhit');
    for (const dbId of triggers) {
      let data = bgSearch.getData(dbId), rules = await bgSearch.theData(dbId, 'rules');
      if (rules.terms) { data.value = ''; data.term = rules.include.values().next().value; }
      data.status = (data.disabled) ? 'Disabled' : 'Enabled';
      displayObjectData([
        {'string':'', 'type':'checkbox', 'width':'25px', 'maxWidth':'25px', 'unique':dbId, 'inputClass':' pcm-checkbox', 'btnFunc':checkboxFunc},
        {'string':'Trigger Type', 'type':'keyValue', 'key':'type', 'width':'50px', 'maxWidth':'50px', id:`pcm-TRT-${dbId}`},
        {'string':'Trigger Name', 'type':'keyValue', 'key':'name', 'width':'420px', 'maxWidth':'420px', id:`pcm-TRN-${dbId}`},
        {'string':'Trigger ID or Term', 'type':'keyValue', 'key':'term', 'orKey': 'value', 'width':'350px', 'maxWidth':'350px', 'id':`pcm-TRID-${dbId}`},
        {'string':'Status', 'type':'keyValue', 'key':'status', 'width':'65px', 'maxWidth':'65px', 'id':`pcm-TRS-${dbId}`},
      ], divContainer, data, true, true);
    }
  }
  /** Filters out jobs with the search term, collecting radio, search mode and once options.
   * @param  {string} search       - Search term to find in title or requester name.
   * @param  {object} modalControl - Jquery element of modalControl to use for these jobs.
   * @return {bool}                - True if job should be shown. */
  async triggersFilter(search, modalControl) {
    let newArray = [];
    for (const dbId of bgSearch.getFrom('Search')) {
      let trigger = bgSearch.getTrigger(dbId), good = false, data = bgSearch.getData(dbId);
      const radioChecked = $(modalControl).find(`input[name='theTriggers']:checked`).val();
      if (radioChecked === '0') good = true;
      else if (radioChecked === '2' && trigger.type === 'rid') good = true;
      else if (radioChecked === '3' && trigger.type === 'gid') good = true;
      else if (radioChecked === '4' && trigger.type === 'custom') good = true;
      if (good && search !== '' && data.name.toLowerCase().includes(search)) good = true;
      else if (good && search !== '') good = false;
      if (good) newArray.push(dbId); console.log(good, search, data.name);
    }
    return newArray;
  }
  showTriggersModal(type='triggers', groupUnique=-1, thisObj=null, saveFunc=null, checkFunc=null, cancelFunc=null, afterShow=null, afterClose=null) {
    if (!modal) modal = new ModalClass();
    const theTitle = (type==='groupingEdit') ? 'Edit Groupings' : 'List Triggers';
    const saveBtnStatus = (type==='groupingEdit') ? 'visible btn-sm' : 'invisible';
    const idName = modal.prepareModal(thisObj, '1000px', 'pcm-showTriggersModal', 'modal-lg', theTitle, '', '', '', saveBtnStatus, 'Save Groupings', saveFunc, 'invisible', 'No', null, 'invisible', 'Close');
    const modalBody = $(`#${idName} .${modal.classModalBody}`);
    let df = document.createDocumentFragment();
    let modalControl = $(`<div class='pcm-modalControl pcm-modalTriggerControl'></div>`).appendTo(df);
    if (type==='groupingEdit') {
      $(`<div class='small pcm-selectTriggers'></div>`).append('Select the triggers you want in this grouping below:').append(`<span class='pcm-triggersInGroup'>Triggers in Group: ${Object.keys(thisObj.triggers).length}</span>`).appendTo(modalControl);
      createInput(modalControl, '', 'pcm-groupingNameI', 'Grouping Name: ', `default: Grouping #${groupUnique}`, null, '', modal.tempObject[idName].name).append(createTimeInput('Start Time', 'pcm-timepicker1', thisObj.startTime));
      createInput(modalControl, '', 'pcm-groupingDescI', 'Description: ', 'default: no description', null, '', modal.tempObject[idName].description).append(createTimeElapse(thisObj.endHours, thisObj.endMinutes));
    }
    const radioGroup = $(`<div class='pcm-groupingsControl'></div>`).appendTo(modalControl);
    radioButtons(radioGroup, 'theTriggers', '0', 'All Triggers', true); 
    if (type === 'jobs') radioButtons(radioGroup, 'theTriggers', '1', 'Collecting');
    radioButtons(radioGroup, 'theTriggers', '2', 'Requester ID Triggers');
    radioButtons(radioGroup, 'theTriggers', '3', 'Group Id Triggers');
    radioButtons(radioGroup, 'theTriggers', '4', 'Custom triggers');
    const inputControl = createInput(modalControl, '', 'pcm-searchinput', 'Search phrase: ', 'example: receipts', (e) => {
      $(e.target).closest('.pcm-modalControl').find('.pcm-searchingTriggers').click();
    });
    $(`<button class='btn btn-xxs pcm-searchingTriggers'>Search</button>`).on( 'click', async (e) => {
      $(modalBody).find('.pcm-jobTable').remove();
      let filtered = await this.triggersFilter($('#pcm-searchinput').val().toLowerCase(), modalControl);
      await this.showTriggersTable(modalBody, filtered, checkFunc, () => {}); if (afterShow) afterShow(this);
    }).appendTo(inputControl);
    $(df).find(`input:radio[name='theJobs']`).click( (e) => {
      $(e.target).closest('.pcm-modalControl').find('.pcm-searchingTriggers').click();
    });
    modal.showModal(cancelFunc, async () => {
      $(`<div class='pcm-modalControl'></div>`).append(df).insertBefore(modalBody);
      let df2 = document.createDocumentFragment();
      let filtered = await this.triggersFilter('', modalControl);
      await this.showTriggersTable(df2, filtered, checkFunc, () => {});
      $(df2).appendTo(modalBody);
      $(`#pcm-timepicker1`).timepicker({ hourGrid: 4, minuteGrid: 10, timeFormat: 'hh:mm tt' });
      $(`#pcm-timepicker1`).on('change', (e) => {
        if ($(e.target).val() === '') { $('#pcm-endHours').val('0'); $('#pcm-endMinutes').val('0'); }
        else if ($('#pcm-endHours').val() === '0' && $('#pcm-endMinutes').val() === '0') $('#pcm-endMinutes').val('30');
      });
      $('#pcm-clearTInput').on('click', e => { $('#pcm-timepicker1').val(''); $('#pcm-endHours').val('0'); $('#pcm-endMinutes').val('0'); });
      if (afterShow) afterShow(this);
    });
  }
}