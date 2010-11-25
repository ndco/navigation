using System.Collections;
using System.Collections.Generic;
using System.Web.UI;

namespace Navigation
{
	/// <summary>
	/// Manages the data passed when navigating. It implements <see cref="System.Web.UI.IStateManager"/>
	/// and so maintains this data across post backs (in control state). This data is accesssible from the
	/// state context <see cref="Navigation.StateContext.Data"/> property and can take part in data binding
	/// using the <see cref="Navigation.NavigationDataSource"/> and <see cref="Navigation.NavigationDataParameter"/>.
	/// It is stored on each <see cref="Navigation.Crumb"/> in a crumb trail as it represents the data
	/// required to recreate the <see cref="System.Web.UI.Page"/> as previously visited
	/// </summary>
	[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1710:IdentifiersShouldHaveCorrectSuffix", Justification="Navigation Data is more appropriate name")]
	public sealed class NavigationData : IStateManager, IEnumerable, IEnumerable<NavigationDataItem>
	{
        private StateBag _Data;

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationData"/> class
		/// </summary>
		public NavigationData() : this(false)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationData"/> class containing
		/// all the data currently in state context <see cref="Navigation.StateContext.Data"/>. Allows
		/// wizard step navigation scenarios where each step is a <see cref="Navigation.State"/> and must 
		/// pass on all its data to the next <see cref="Navigation.State"/>
		/// </summary>
		public NavigationData(bool includeCurrent)
			: base()
		{
			if (includeCurrent)
			{
				foreach (NavigationDataItem item in StateContext.Data)
				{
					Data[item.Key] = item.Value;
				}

			}
		}

		private StateBag Data
		{
            get
            {
                if (_Data == null)
                {
                    _Data = new StateBag();
                    ((IStateManager)_Data).TrackViewState();
                }
                return _Data;
            }
        }

		/// <summary>
		/// Adds a new item to the underlying <see cref="System.Web.UI.StateBag"/>, updating the item
		/// if it already exists. If the <paramref name="value"/> is null the item is removed
		/// </summary>
		/// <param name="key">The key for the navigation data item</param>
		/// <param name="value">The value for navigation data item</param>
		public void Add(string key, object value)
		{
			if (value != null)
				Data.Add(key, value);
			else
				Remove(key);
		}

		/// <summary>
		/// Removes the specified key/value pair from the <see cref="System.Web.UI.StateBag"/>. This
		/// is the equivalent of setting the value to null
		/// </summary>
		/// <param name="key"></param>
		public void Remove(string key)
		{
			Data.Remove(key);
		}

		/// <summary>
		/// Gets or sets the value of an item stored in the <see cref="System.Web.UI.StateBag"/>
		/// </summary>
		/// <param name="key">The key for the navigation data item</param>
		/// <returns>The value for navigation data item</returns>
		public object this[string key]
		{
			get
			{
				return Data[key];
			}
			set
			{
				Add(key, value);
			}
		}

		internal void Clear()
		{
			Data.Clear();
		}

        bool IStateManager.IsTrackingViewState
        {
            get 
            {
                return ((IStateManager)Data).IsTrackingViewState;
            }
        }

        void IStateManager.LoadViewState(object state)
        {
            ((IStateManager)Data).LoadViewState(state);
        }

        object IStateManager.SaveViewState()
        {
            return ((IStateManager)Data).SaveViewState();
        }

        void IStateManager.TrackViewState()
        {
            ((IStateManager)Data).TrackViewState();
        }

		IEnumerator IEnumerable.GetEnumerator()
		{
			foreach (NavigationDataItem item in this)
			{
				yield return item;
			}
		}

		/// <summary>
		/// Returns an <see cref="System.Collections.Generic.IEnumerator{T}"/> that iterates through
		/// the <see cref="Navigation.NavigationDataItem"/> elements
		/// </summary>
		/// <returns>An <see cref="System.Collections.Generic.IEnumerator{T}"/> for
		/// the <see cref="Navigation.NavigationData"/></returns>
		public IEnumerator<NavigationDataItem> GetEnumerator()
		{
			foreach(DictionaryEntry entry in Data)
			{
				yield return new NavigationDataItem((string)entry.Key, ((StateItem)entry.Value).Value);
			}
		}
	}
}
