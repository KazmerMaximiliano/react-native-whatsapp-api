/* #region IMPORTS */
import {WP_NUMBER_ID, WP_TOKEN, WP_VERSION} from '@env';
import {
  Button,
  Card,
  Divider,
  Input,
  Layout,
  List,
  ListItem,
  Select,
  SelectItem,
  Tab,
  TabBar,
  Text,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
const templates = require('../templates.json');
/* #endregion */

export const HomeScreen = () => {
  /* region STATE */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [numberInput, setNumberInput] = useState(null);
  const [numberList, setNumberList] = useState([]);
  const [selectTemplate, setSelectTemplate] = useState(0);
  /* endregion */

  /* region CONSTS */
  const templatesNames = templates.map(template => template.name);
  const selectDisplayValue = templatesNames[selectTemplate.row];
  const inputDisplayValue = selectTemplate
    ? templates[selectTemplate.row].message
    : null;
  /* #endregion */

  /* region METHODS */
  const sendWhatsAppMessage = () => {
    const url = `https://graph.facebook.com/v${WP_VERSION}/${WP_NUMBER_ID}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WP_TOKEN}`,
    };

    numberList.forEach(number => {
      const body = {
        messaging_product: 'whatsapp',
        preview_url: false,
        recipient_type: 'individual',
        to: number.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: selectDisplayValue,
          language: {
            code: 'es_AR',
          },
        },
      };
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      })
        .then(response => {
          response.json().then(data => {
            console.log('response', data);
          });
        })
        .catch(error => {
          console.log('error', error);
        });
    });
  };

  /* #endregion */

  const messagesForm = () => {
    return (
      <View>
        <Select
          style={styles.select}
          placeholder="Seleccionar Template"
          selectedIndex={selectTemplate}
          value={selectDisplayValue}
          onSelect={index => setSelectTemplate(index)}>
          {templatesNames.map((name, index) => (
            <SelectItem key={index} title={name} />
          ))}
        </Select>
        <Input
          multiline={true}
          placeholder="Mensaje"
          value={inputDisplayValue}
          textStyle={styles.messageText}
          disabled={true}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              sendWhatsAppMessage();
            }}
            style={styles.numberButton}
            status="">
            Enviar
          </Button>
        </View>
      </View>
    );
  };

  const renderNumberItem = ({item, index}) => (
    <ListItem title={item} key={index} />
  );

  const numbersForm = () => {
    return (
      <View>
        <Input
          placeholder="Número (+00 1234 56-7890)"
          value={numberInput}
          onChangeText={nextValue => setNumberInput(nextValue)}
        />
        <List
          data={numberList}
          ItemSeparatorComponent={Divider}
          renderItem={renderNumberItem}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              setNumberList([]);
            }}
            style={styles.numberButton}
            status="danger">
            Borrar todos
          </Button>
          <View style={styles.numberButtonSeparator} />
          <Button
            onPress={() => {
              if (numberInput) {
                setNumberList([...numberList, numberInput]);
                setNumberInput(null);
              }
            }}
            style={styles.numberButton}
            status="success">
            Agregar
          </Button>
        </View>
      </View>
    );
  };

  const tabBody = [messagesForm(), numbersForm()];
  /* #endregion */

  /* region RENDER */
  return (
    <Layout style={styles.container}>
      <Card style={styles.card} disabled={true} status="success">
        <TabBar
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
          style={styles.tabBar}
          indicatorStyle={styles.indicator}>
          <Tab
            title={evaProps => (
              <Text
                {...evaProps}
                style={
                  selectedIndex === 0 ? styles.tabTextActive : styles.tabText
                }>
                Mensaje
              </Text>
            )}
          />
          <Tab
            title={evaProps => (
              <Text
                {...evaProps}
                style={
                  selectedIndex === 1 ? styles.tabTextActive : styles.tabText
                }>
                Numeros
              </Text>
            )}
          />
        </TabBar>
        <Divider style={styles.divider} />
        {tabBody[selectedIndex]}
      </Card>

      <Card style={styles.card} status="info">
        <Text style={styles.templateInfoText}>
          Los "templates" de cada mensaje se crean en
          https://business.facebook.com/wa/manage/message-templates/
        </Text>
      </Card>
    </Layout>
  );
  /* endregion */
};

/* region STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '90%',
    marginVertical: 4,
  },

  tabBar: {
    marginVertical: 2,
    color: '#fff',
  },

  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  tabTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#45E096',
  },

  indicator: {
    height: 0,
  },

  divider: {
    marginVertical: 8,
  },

  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
  },

  numberButton: {
    flex: 1,
  },

  numberButtonSeparator: {
    width: 8,
  },

  messageText: {
    minHeight: 64,
  },

  select: {
    marginBottom: 16,
  },

  templateInfoText: {
    fontSize: 12,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
});
/* endregion */
