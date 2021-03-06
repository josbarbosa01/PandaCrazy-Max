/** Class which handles the global status.
 * @class PandaGStats
 * @author JohnnyRS - johnnyrs@allbyjohn.com */
class PandaGStats {
	constructor() {
		this.collecting = { value:false, id:'#pcm-collecting', disabled:false, type:'boolean', on:'pcm-span-on', off:'pcm-span-off', paused:'pcm-span-paused' };
		this.collectingTotal = {value:0, id:'#pcm-collectingTotal', disabled:false, type:'integer', 'string':'', 'post':''};
		this.pandaElapsed = {value:0, id:'#pcm-pandaElapsed', disabled:false, type:'integer', 'string':'Elapsed: ', 'post':'ms'};
		this.pandaTimer = {value:0, id:'#pcm-pandaTimer', disabled:true, type:'integer', 'string':'Timer set at: ', 'post':'ms'};
		this.pandaHamTimer = {value:0, id:'#pcm-pandaHamTimer', disabled:true, type:'integer', 'string':'Ham Timer set at: ', 'post':'ms'};
		this.searchTimer = {value:0, id:'#pcm-searchTimer', disabled:true, type:'integer', 'string':'Search Timer set at: ', 'post':'ms'};
		this.queueTimer = {value:0, id:'#pcm-queueTimer', disabled:true, type:'integer', 'string':'Queue Timer set at: ', 'post':'ms'};
		this.totalAccepted = {value:0, id:'#pcm-totalAccepted', disabled:false, type:'integer', 'string':'Accepted: ', 'post':'', 'updateEffect':true};
		this.totalFetched = {value:0, id:'#pcm-totalFetched', disabled:true, type:'integer', 'string':'Fetched: ', 'post':''};
		this.totalNoMore = {value:0, id:'#pcm-totalNoMore', disabled:true, type:'integer', 'string':'No More: ', 'post':''};
		this.totalErrors = {value:0, id:'#pcm-totalErrors', disabled:true, type:'integer', 'string':'Errors: ', 'post':'', 'updateEffect':true};
		this.totalPandaPREs = {value:0, id:'#pcm-totalPandaPREs', disabled:false, type:'integer', 'string':`PRE's: `, 'post':'', 'updateEffect':true};
		this.totalSearchPREs = {value:0, id:'#pcm-totalSearchPREs', disabled:true, type:'integer', 'string':`Search PRE's: `, 'post':'', 'updateEffect':true};
		this.totalPREs = {value:0, id:'#pcm-totalPREs', disabled:true, type:'integer', 'string':`Total PRE's: `, 'post':'', 'updateEffect':true};
		this.totalEarned = {value:'?.??', id:'#pcm-totalEarned', disabled:false, type:'price', 'string':'Total Earnings: $', 'post':'', 'updateEffect':true};
		this.totalPotential = {value:'?.??', id:'#pcm-totalPotential', disabled:true, type:'price', 'string':'Potential: $', 'post':'', 'updateEffect':true};
		this.totalEarnedInQueue = {value:'0.00', id:'#pcm-totalQueueEarnings', disabled:true, type:'price', 'string':'Queue Earnings: $', 'post':'', 'updateEffect':true};
		this.totalPandas = {value:0, id:'#pcm-totalPandas', disabled:false, type:'integer', 'string':`Panda Jobs: `, 'post':'', 'updateEffect':true};
		this.totalSearches = {value:0, id:'#pcm-totalSearches', disabled:true, type:'integer', 'string':`Search Jobs: `, 'post':'', 'updateEffect':true};
		this.totalSubmitted = {value:0, id:'#pcm-totalSubmitted', disabled:true, type:'integer', 'string':`Submitted: `, 'post':'', 'updateEffect':true};
		this.totalReturned = {value:0, id:'#pcm-totalReturned', disabled:true, type:'integer', 'string':`Returned: `, 'post':'', 'updateEffect':true};
		this.totalAbandoned = {value:0, id:'#pcm-totalAbandoned', disabled:true, type:'integer', 'string':`Abandoned: `, 'post':'', 'updateEffect':true};
		this.timerStats = [this.pandaElapsed, this.pandaTimer, this.pandaHamTimer, this.searchTimer, this.queueTimer];
		this.jobFetchStats = [this.totalAccepted, this.totalFetched, this.totalErrors];
		this.preStats = [this.totalPandaPREs, this.totalSearchPREs, this.totalPREs];
		this.jobStats = [this.totalPandas, this.totalSearches, this.totalSubmitted, this.totalReturned, this.totalAbandoned];
		this.earningsStats = [this.totalEarned, this.totalPotential, this.totalEarnedInQueue];
		this.prepare();
	}
	/** Updates the status bar for a specific stat with updated stat or with the text supplied.
	 * @param  {object} statObj		- Status object @param  {string} [text=''] - Text to show in the status bar for this specific stat in object. */
	updateStatNav(statObj, text='', className=null, effect=true) {
		if (text === '') {
			if (statObj.disabled === true) $(statObj.id).hide();
			else {
				let cssVar = getCSSVar(statObj.id.replace('#pcm-', ''), statObj.string), newValue = `${cssVar}${statObj.value}${statObj.post}`;
				if (className) $(statObj.id).removeClass().addClass(className);
				else if ($(statObj.id).html() !== newValue) {
					$(statObj.id).show().html(newValue);
					if (statObj.updateEffect && effect) $(statObj.id).stop(true,true).css('color','Tomato').animate({'color':'#f3fd7d'}, 3500);
				}
			}
		} else {
			if (statObj.disabled === true) $(statObj.id).hide().html(text);
			else $(statObj.id).html(text);
		}
	}
	/** Prepare the status bar with values and hide the disabled status values. */
	prepare() {
		$('#pcm-timerStats').append(`<span id='pcm-pandaElapsed' class='1'></span><span id='pcm-pandaTimer' class='2'></span><span id='pcm-pandaHamTimer' class='3'></span><span id='pcm-searchTimer' class='4'></span><span id='pcm-queueTimer' class='5'></span>`).data('toggled', 1).data('max',5).data('array', 'timerStats');
		$('#pcm-jobFetchStats').append(`<span id='pcm-totalAccepted' class='1'></span><span id='pcm-totalFetched' class='2'></span><span id='pcm-totalErrors' class='3'></span>`).data('toggled', 1).data('max',3).data('array', 'jobFetchStats');
		$('#pcm-preStats').append(`<span id='pcm-totalPandaPREs' class='1'></span><span id='pcm-totalSearchPREs' class='2'></span><span id='pcm-totalPREs' class='3'></span>`).data('toggled', 1).data('max',3).data('array', 'preStats');
		$('#pcm-jobStats').append(`<span id='pcm-totalPandas' class='1'></span><span id='pcm-totalSearches' class='2'></span><span id='pcm-totalSubmitted' class='3'></span><span id='pcm-totalReturned' class='4'></span><span id='pcm-totalAbandoned' class='5'></span>`).data('toggled', 1).data('max',5).data('array', 'jobStats');
		$('#pcm-earningsStats').append(`<span id='pcm-totalEarned' class='1'></span><span id='pcm-totalPotential' class='2'></span><span id='pcm-totalQueueEarnings' class='3'></span>`).data('toggled', 1).data('max',3).data('array', 'earningsStats');
		this.updateStatNav(this.timerStats[0]); this.updateStatNav(this.jobFetchStats[0]); this.updateStatNav(this.preStats[0]);
		this.updateStatNav(this.totalEarned); this.updateStatNav(this.totalPandas);
		$('.pcm-statArea .toggle').click( (e) => {
			let theToggle = $(e.target).closest('.toggle'), toggled = theToggle.data('toggled'), max = theToggle.data('max'); let theArray = theToggle.data('array');
			if (theToggle.data('longClicked')) theToggle.removeData('longClicked');
			else {
				this[theArray][toggled-1].disabled = true; toggled = (++toggled > max) ? 1 : toggled; theToggle.data('toggled', toggled);  this[theArray][toggled-1].disabled = false;
				theToggle.find('span').hide(); theToggle.find(`.${toggled}`).show().stop(true,true).css('color','Tomato').animate({'color':'#f3fd7d'}, 3500);
				this.updateStatNav(this[theArray][toggled-1]);
			}
		});
		$('#pcm-earningsStats').on('long-press', async e => {
			e.preventDefault(); $(e.target).closest('.toggle').data('longClicked', true);
			if (!dashboard.isFetching()) dashboard.doDashEarns();
		});
	}
  /** Add 1 to the PRE counter and update status bar. */
	addPandaPRE() { this.totalPandaPREs.value++; this.updateStatNav(this.totalPandaPREs); }
  /** Add 1 to the total panda's fetched counter and update status bar. */
	addTotalFetched() { this.totalFetched.value++; this.updateStatNav(this.totalFetched); }
  /** Add 1 to the total no more counter and update status bar. */
	addTotalNoMore() { this.totalNoMore.value++; this.updateStatNav(this.totalNoMore); }
  /** Add 1 to the total accepted counter and update status bar. */
	addTotalAccepted() { this.totalAccepted.value++; this.updateStatNav(this.totalAccepted); }
  /** Set the collecting value to on and then update the stat on the status bar. */
	collectingOn() { this.collecting.value = true; this.updateStatNav(this.collecting, '', this.collecting.on); }
  /** Set the collecting value to off and then update the stat on the status bar. */
	collectingOff() { if (this.collectingTotal.value<1) { this.collecting.value = false; this.updateStatNav(this.collecting, '', this.collecting.off); } }
  /** Set the collecting value to paused and update the stat on the status bar. */
	collectingPaused() { this.updateStatNav(this.collecting, '', this.collecting.paused); }
  /** Set the collecting value to unpaused and update the stat on the status bar. */
	collectingUnPaused() { this.updateStatNav(this.collecting, '', (this.collecting.value) ? this.collecting.on : this.collecting.off ); }
  /** Add 1 to the total collecting jobs counter and update it on the status bar. */
	addCollecting() { this.collectingTotal.value++; this.updateStatNav(this.collectingTotal); }
  /** Subtract 1 to the total collecting jobs counter and update it on the status bar. */
	subCollecting() { this.collectingTotal.value--; this.updateStatNav(this.collectingTotal); }
  /** Add 1 to the total panda error counter and update it on the status bar. */
	addTotalPandaErrors() { this.totalErrors.value++; this.updateStatNav(this.totalErrors); }
	/** Set the elapsed timer value and then update it on the status bar.
	 * @param  {number} value - The value to change the elapsed time value. */
	setPandaElapsed(value) { this.pandaElapsed.value = value; this.updateStatNav(this.pandaElapsed); }
	/** Set the panda timer value and then update it on the status bar.
	 * @param  {number} value - The value to change the panda timer value. */
	setPandaTimer(value) { this.pandaTimer.value = value; this.updateStatNav(this.pandaTimer); }
	/** Set the ham timer value and then update it on the status bar.
	 * @param  {number} value - The value to change the ham timer value. */
	setHamTimer(value) { this.pandaHamTimer.value = value; this.updateStatNav(this.pandaHamTimer); }
	/** Set the search timer value and then update it on the status bar.
	 * @param  {number} value - The value to change the search timer value. */
	setSearchTimer(value) { this.searchTimer.value = value; this.updateStatNav(this.searchTimer); }
	/** Set the search timer value and then update it on the status bar.
	 * @param  {number} value - The value to change the search timer value. */
	setQueueTimer(value) { this.queueTimer.value = value; this.updateStatNav(this.queueTimer); }
	/** Set the total earned from the potential earnings and the hits in the queue. */
	setTotalEarned() {
		this.totalEarned.value = (Number(this.totalPotential.value) + Number(this.totalEarnedInQueue.value)).toFixed(2);
		this.updateStatNav(this.totalEarned);
	}
	/** Set the total earned value and then update it on the status bar.
	 * @param  {number} value - The earned value. @param {bool} - Add 1 to earnings.
	 * @return {string}       - The value of the potential earnings. */
	thePotentialEarnings(value=null, addTo=null) {
		if (addTo !== null) value = Number(this.totalPotential.value) + addTo;
		if (value !== null) { this.totalPotential.value = Number(value).toFixed(2); this.updateStatNav(this.totalPotential); this.setTotalEarned(); }
		else return this.totalPotential.value;
	}
	waitEarningsPage(page=1) {
		this.updateStatNav(this.totalEarned, `${this.totalEarned.string} [page ${page}]`);
		this.updateStatNav(this.totalPotential, `${this.totalPotential.string} [page ${page}]`);
	}
	/** Set the total value in queue value and then update it on the status bar.
	 * @param  {number} value - the value to change the total value in queue value. */
	setTotalValueInQueue(value) { this.totalEarnedInQueue.value = value; this.updateStatNav(this.totalEarnedInQueue); this.setTotalEarned(); }
  /** Add 1 to the total number of panda's loaded and update it on the status bar. */
	addPanda() { this.totalPandas.value++; this.updateStatNav(this.totalPandas); }
  /** Subtract 1 to the total number of panda's loaded and update it on the status bar. */
	subPanda() { this.totalPandas.value--; this.updateStatNav(this.totalPandas); }
  /** Add 1 to the total number of search jobs loaded and update it on the status bar. */
	addSearch() { this.totalSearches.value++; this.updateStatNav(this.totalSearches); }
  /** Subtract 1 to the total number of search jobs loaded and update it on the status bar. */
	subSearch() { this.totalSearches.value--; this.updateStatNav(this.totalSearches); }
  /** Add 1 to the total number of search jobs loaded and update it on the status bar. */
	addSubmitted() { this.totalSubmitted.value++; this.updateStatNav(this.totalSubmitted); }
  /** Resets stats when wiping data for importing. */
	resetStats() { this.totalPandas.value = 0; this.totalSearches.value = 0; this.totalSubmitted.value = 0; }
}
