import { Promise as EmberPromise } from 'rsvp';
import { getOwner } from '@ember/application';
import ObjectProxy from '@ember/object/proxy';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import EmberValidations from 'ember-validations';
import ExchangeRateMixin from 'fakturama/mixins/exchange-rate';
import FormMixin from 'fakturama/mixins/form';
import InvoicePropertiesMixin from 'fakturama/mixins/invoice-properties';
import Item from 'fakturama/models/item';
import ItemForm from 'fakturama/forms/item';

const { oneWay } = computed;

export default ObjectProxy.extend(
  EmberValidations,
  FormMixin,
  ExchangeRateMixin,
  InvoicePropertiesMixin,
  {
    store: service('store'),
    validations: {
      number: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusty'
        }
      },
      issueDate: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusta'
        }
      },
      deliveryDate: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusta'
        }
      },
      dueDays: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusta'
        },
        numericality: {
          if: 'isSubmitted',
          greaterThanOrEqualTo: 0,
          messages: {
            greaterThanOrEqualTo: 'nie może być ujemny'
          }
        }
      },
      seller: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusty'
        }
      },
      buyer: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusty'
        }
      },
      currencyCode: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusta'
        }
      },
      languageCode: {
        presence: {
          if: 'isSubmitted',
          message: 'nie może być pusta'
        }
      },
      exchangeDate: {
        presence: {
          if: function(invoice) {
            return invoice.get('isSubmitted') && invoice.get('isExchanging');
          },
          message: 'nie może być pusta'
        }
      }
    },

    id: oneWay('model.id'),
    number: oneWay('model.number'),
    issueDate: oneWay('model.issueDate'),
    deliveryDate: oneWay('model.deliveryDate'),
    seller: oneWay('model.seller'),
    buyer: oneWay('model.buyer'),
    recipient: oneWay('model.recipient'),
    currencyCode: oneWay('model.currencyCode'),
    languageCode: oneWay('model.languageCode'),
    accountBankName: oneWay('model.accountBankName'),
    accountSwift: oneWay('model.accountSwift'),
    accountNumber: oneWay('model.accountNumber'),
    isPaid: oneWay('model.isPaid'),
    paidWithCash: oneWay('model.paidWithCash'),

    items: computed(
      'model.itemsAttributes',
      'model.itemsAttributes.@each',
      function() {
        return this.getWithDefault('model.itemsAttributes', []).map(
          itemAttributes => {
            return ItemForm.create({
              model: Item.create(
                Object.assign({}, itemAttributes, { container: getOwner(this) })
              ),
              invoiceForm: this
            });
          }
        );
      }
    ),

    itemsAttributes: computed('items', 'items.@each', function() {
      return this.get('items').invoke('toJSON');
    }),

    comment: oneWay('model.comment'),
    sellerSignature: oneWay('model.sellerSignature'),
    buyerSignature: oneWay('model.buyerSignature'),

    isSubmitted: false,
    isIssueDelivery: true,
    dueDays: 14,

    initIssueDate: function() {
      if (!this.get('issueDate')) {
        this.set('issueDate', new Date().toISOString().substr(0, 10));
      }
    }.on('init'),

    initIsIssueDelivery: function() {
      this.set(
        'isIssueDelivery',
        this.get('issueDate') === this.get('deliveryDate')
      );
    }.on('init'),

    initDueDays: function() {
      var issueDate = Date.parse(this.get('issueDate')),
        dueDate = Date.parse(this.get('dueDate'));

      if (!isNaN(issueDate) && !isNaN(dueDate)) {
        this.set('dueDays', (dueDate - issueDate) / (1000 * 60 * 60 * 24));
      }
    }.on('init'),

    isIssueDeliveryOrIssueDateDidChange: function() {
      if (this.get('isIssueDelivery')) {
        this.set('deliveryDate', this.get('issueDate'));
      }
    }.observes('isIssueDelivery', 'issueDate'),

    dueDaysOrIssueDateDidChange: function() {
      var date,
        dueDays = this.get('dueDays'),
        issueDate = this.get('issueDate');

      date = Date.parse(issueDate) + 1000 * 60 * 60 * 24 * dueDays;

      if (!isNaN(date)) {
        this.set('dueDate', new Date(date).toISOString().substr(0, 10));
      }
    }.observes('dueDays', 'issueDate'),

    addItem: function() {
      const item = ItemForm.create({
        invoiceForm: this,
        model: Item.create({
          quantity: 0,
          netPrice: 0,
          container: getOwner(this)
        })
      });
      this.get('items').pushObject(item);
    },

    validate() {
      return EmberPromise.all(
        [this._super()].concat(this.get('items').invoke('validate'))
      );
    },

    currency: computed('currencyCode', function() {
      const code = this.get('currencyCode');

      if (code) {
        return this.get('store').queryRecord('currency', { code });
      }
    }),

    language: oneWay('languageCode', function() {
      const code = this.get('languageCode');

      if (code) {
        return this.get('store').findRecord('language', code);
      }
    })
  }
);
