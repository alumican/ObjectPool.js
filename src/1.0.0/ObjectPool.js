/**
 * @fileOverview
 * @name ObjectPool.js
 * @author alumican yukiya@alumican.net http://alumican.net/
 * @url
 * @version 1.0.0
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 */

/** 
 * @namespace Namespace of alumican libs.
 */
var ALUMICAN;
if (!ALUMICAN) ALUMICAN = {}; 

/**
 * ObjectPool class.
 * @class
 * @param {function} onRequireItem This callback function is called when new item is required.
 * @param {function} onDestroyItem This callback function is called when item is disposed.
 * @param {integer} initCount Init item count.
 * @param {integer} growthCount Growth item count.
 *
 * @property {integer} initCount Init item count.
 * @property {integer} growthCount Growth item count.
 * @property {function} onRequireItem This callback function is called when new item is required.
 * @property {function} onDestroyItem This callback function is called when item is disposed.
 * @property {array} items Array of items.
 * @property {integer} index Current index of items.
 *
 * @return void
 */
ALUMICAN.ObjectPool = function(onRequireItem, onDestroyItem, initCount, growthCount)
{
	this.onRequireItem;
	this.onDestroyItem;
	this.initCount;
	this.growthCount;
	this.items;
	this.index;

	//----------------------------------------
	//call construntor
	this._initialize.apply(this, arguments);
}

/**
 * Version information.
 * @static
 * @constant
 */
ALUMICAN.ObjectPool.version = "1.0.0";

ALUMICAN.ObjectPool.prototype =
{
	/**
	 * Get item from object pool.
	 * @return {object} Item
	 */
	getItem : function()
	{
		if (this.index > 0) return this.items[--this.index];
		for (var i = 0; i < this.growthCount; ++i)
		{
			this.items.unshift(this.onRequireItem());
		}
		this.index = this.growthCount;
		return this.getItem();
	},
	
	/**
	 * Return item to object pool.
	 * @param {object} Item.
	 * @return void
	 */
	returnItem : function(item)
	{
		this.items[this.index++] = item;
	},
	
	/**
	 * Optimize object pool size.
	 * @return void
	 */
	reduce : function()
	{
		var n = this.index;
		for (var i = 0; i < n; ++i)
		{
			this.onDestroyItem(this.items.pop());
		}
		this.index = 0;
	},
	
	/**
	 * Destroy object pool.
	 * @return void
	 */
	destroy : function()
	{
		var n = this.items.length;
		for (var i = 0; i < n; ++i)
		{
			this.onDestroyItem(this.items[i]);
		}
		this.items = null;
		this.onRequireItem = null;
		this.onDestroyItem = null;
	},
	
	//----------------------------------------
	/**
	 * #@+
	 * @private
	 */
	_initialize : function(onRequireItem, onDestroyItem, initCount, growthCount)
	{
		this.onRequireItem = (onRequireItem != undefined) ? onRequireItem : function() { return {} };
		this.onDestroyItem = (onDestroyItem != undefined) ? onDestroyItem : function(item) {};
		this.initCount     = (initCount     != undefined) ? initCount     : 100;
		this.growthCount   = (growthCount   != undefined) ? growthCount   : 50;
		this.items = new Array(this.initCount);
		for (var i = 0; i < this.initCount; ++i)
		{
			this.items[i] = this.onRequireItem();
		}
		this.index = this.initCount;
	}
	
	/** #@- */
}