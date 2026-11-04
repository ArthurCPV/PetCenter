import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  styles_th,
} from "../styles/theme";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useAlerts,
} from "../store/useAlerts";

import AlertFormModal from "../components/AlertFormModal";
import PetFilter from "../components/PetFilter";
import { useAlertNotifications } from "../store/useAlertNotifications";

import type {
  Alerta,
  CreateAlertData,
} from "../types";

const getAlertTypeLabel = (
  type: string,
): string => {
  switch (type) {
    case "CONSULTA":
      return "Consulta";

    case "REMEDIO":
      return "Remédio";

    case "ALIMENTACAO":
      return "Alimentação";

    case "EXERCICIO":
      return "Exercício";

    case "OUTROS":
      return "Outros";

    default:
      return type;
  }
};

const formatDate = (
  date: string,
): string => {
  return new Date(
    date,
  ).toLocaleString(
    "pt-BR",
  );
};

const Alerts = () => {
  const {
    user,
  } = useAuth();

  const {
    alerts,
    pets,
    isLoading,
    isRefreshing,
    loadError,
    addAlert,
    activateAlert,
    deactivateAlert,
    refresh,
  } = useAlerts();

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);
  const [
    petSearch,
    setPetSearch,
  ] = useState("");
  const [
    selectedPetFilterId,
    setSelectedPetFilterId,
  ] = useState<string | undefined>();

  const isVeterinarian =
    user?.tipoUsuario ===
    "VETERINARIO";
  const isTutor = user?.tipoUsuario === "TUTOR";

  const visibleAlerts =
    useMemo<
      Alerta[]
    >(
      () => {
        if (
          isVeterinarian
        ) {
          return alerts;
        }

        const ownPetIds =
          new Set(
            pets.map(
              (pet) =>
                Number(
                  pet.id,
                ),
            ),
          );

        return alerts.filter(
          (
            alert: Alerta,
          ) =>
            ownPetIds.has(
              alert.petId,
            ),
        );
      },
      [
        alerts,
        pets,
        isVeterinarian,
      ],
    );

  const {
    hasPermission: hasNotificationPermission,
    isLoading: isLoadingNotifications,
    error: notificationError,
    enable: enableNotifications,
  } = useAlertNotifications(isTutor ? user?.id : undefined, visibleAlerts);

  const filteredAlerts = useMemo(() => {
    const query = petSearch.trim().toLocaleLowerCase();

    return visibleAlerts.filter((alert) => {
      const matchesPet =
        selectedPetFilterId === undefined ||
        alert.petId === Number(selectedPetFilterId);
      const matchesSearch =
        !query ||
        alert.petNome.toLocaleLowerCase().includes(query) ||
        String(alert.petId).includes(query);

      return matchesPet && matchesSearch;
    });
  }, [petSearch, selectedPetFilterId, visibleAlerts]);

  const activeAlerts =
    useMemo<
      Alerta[]
    >(
      () =>
        filteredAlerts.filter(
          (
            alert: Alerta,
          ) =>
            alert.ativo,
        ),
      [
        filteredAlerts,
      ],
    );

  const inactiveAlerts =
    useMemo<
      Alerta[]
    >(
      () =>
        filteredAlerts.filter(
          (
            alert: Alerta,
          ) =>
            !alert.ativo,
        ),
      [
        filteredAlerts,
      ],
    );

  const handleToggleAlert =
    (
      alert: Alerta,
    ): void => {
      if (!isVeterinarian) {
        return;
      }

      const actionLabel = alert.ativo ? "Desativar" : "Ativar";
      const confirmMessage = alert.ativo
        ? "Tem certeza que deseja desativar este alerta?"
        : "Tem certeza que deseja ativar este alerta?";

      Alert.alert(
        `${actionLabel} alerta`,
        confirmMessage,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: actionLabel,
            style: alert.ativo ? "destructive" : "default",
            onPress: () => {
              void (async () => {
                try {
                  if (alert.ativo) {
                    await deactivateAlert(String(alert.id));
                  } else {
                    await activateAlert(String(alert.id));
                  }
                } catch (error) {
                  Alert.alert(
                    "Erro",
                    error instanceof Error
                      ? error.message
                      : `Não foi possível ${alert.ativo ? "desativar" : "ativar"} o alerta.`,
                  );
                }
              })();
            },
          },
        ],
      );
    };

  if (isLoading) {
    return (
      <View
        style={[
          styles_th.container,
          {
            justifyContent:
              "center",
            alignItems:
              "center",
          },
        ]}
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={{
            marginTop: 12,
            color: "#666",
          }}
        >
          Carregando alertas...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles_th.container
      }
    >
      <View
        style={
          styles_th.header
        }
      >
        <Text
          style={
            styles_th.title
          }
        >
          Alertas
        </Text>

        <Text
          style={
            styles_th.subtitle
          }
        >
          {isVeterinarian
            ? "Gerencie os alertas dos pets"
            : "Acompanhe os alertas dos seus pets"}
        </Text>
      </View>

      {loadError ? (
        <Text
          accessibilityRole="alert"
          style={{
            marginHorizontal: 20,
            marginBottom: 14,
            color: "#B71C1C",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          Não foi possível atualizar os alertas: {loadError}
        </Text>
      ) : undefined}

      {isTutor && !isLoadingNotifications && !hasNotificationPermission ? (
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 14,
            padding: 14,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#F0DADA",
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              color: "#2D2D2D",
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Receba lembretes neste aparelho conforme a frequência definida pelo veterinário.
          </Text>
          <TouchableOpacity
            onPress={() => {
              void (async () => {
                try {
                  await enableNotifications();
                } catch (error) {
                  Alert.alert(
                    "Notificações",
                    error instanceof Error
                      ? error.message
                      : "Não foi possível atualizar as notificações.",
                  );
                }
              })();
            }}
            style={{
              minHeight: 44,
              marginTop: 10,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: "#E53935",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#E53935",
                fontWeight: "700",
              }}
            >
              Ativar notificações
            </Text>
          </TouchableOpacity>
        </View>
      ) : undefined}

      {isTutor && notificationError ? (
        <Text
          accessibilityRole="alert"
          style={{
            marginHorizontal: 20,
            marginBottom: 14,
            color: "#B71C1C",
            fontSize: 12,
          }}
        >
          {notificationError}
        </Text>
      ) : undefined}

      {isVeterinarian ? (
        <TouchableOpacity
          onPress={() =>
            setModalVisible(
              true,
            )
          }
          style={[
            styles_th.button,
            {
              width: "90%",
              alignSelf:
                "center",
              marginLeft: 0,
              marginBottom: 15,
              borderRadius: 16,
            },
          ]}
        >
          <Text
            style={{
              color:
                "#fff",
              fontWeight:
                "bold",
              fontSize: 16,
              textAlign:
                "center",
            }}
          >
            + Criar alerta
          </Text>
        </TouchableOpacity>
      ) : undefined}

      {pets.length > 0 ? (
        <PetFilter
          pets={pets}
          search={petSearch}
          selectedPetId={selectedPetFilterId}
          onSearchChange={setPetSearch}
          onPetChange={setSelectedPetFilterId}
        />
      ) : undefined}

      <FlatList<Alerta>
        data={
          activeAlerts
        }
        keyExtractor={(
          item,
        ) =>
          String(
            item.id,
          )}
        refreshing={
          isRefreshing
        }
        onRefresh={() =>
          void refresh()
        }
        renderItem={({
          item,
        }) => (
          <View
            style={
              styles_th.item
            }
          >
            <Text
              style={
                styles_th.itemTitle
              }
            >
              {item.titulo}
            </Text>

            <Text
              style={
                styles_th.itemDate
              }
            >
              {item.petNome} •{" "}
              {getAlertTypeLabel(
                item.tipo,
              )}
            </Text>

            {item.descricao ? (
              <Text
                style={[
                  styles_th.itemDate,
                  {
                    marginTop: 6,
                  },
                ]}
              >
                {
                  item.descricao
                }
              </Text>
            ) : undefined}

            <Text
              style={{
                marginTop: 8,
                color:
                  "#777",
                fontSize: 12,
              }}
            >
              Responsável:{" "}
              {
                item.veterinarioNome
              }
            </Text>

            <Text
              style={{
                marginTop: 5,
                color:
                  "#777",
                fontSize: 12,
              }}
            >
              Início:{" "}
              {formatDate(
                item.dataInicio,
              )}
            </Text>

            {item.frequenciaHoras ? (
              <Text
                style={{
                  marginTop: 8,
                  color: "#777",
                  fontSize: 12,
                }}
              >
                Frequência: a cada {item.frequenciaHoras} hora(s)
              </Text>
            ) : (
              <Text
                style={{
                  marginTop: 8,
                  color: "#777",
                  fontSize: 12,
                }}
              >
                Lembrete único
              </Text>
            )}

            {isVeterinarian ? (
              <TouchableOpacity
                onPress={() => handleToggleAlert(item)}
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E53935",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#E53935",
                    fontWeight: "bold",
                  }}
                >
                  Desativar alerta
                </Text>
              </TouchableOpacity>
            ) : undefined}
          </View>
        )}
        ListHeaderComponent={
          <Text
            style={[
              styles_th.sectionTitle,
              {
                marginBottom: 10,
              },
            ]}
          >
            Alertas ativos
          </Text>
        }
        ListEmptyComponent={
          <Text
            style={
              styles_th.emptyText
            }
          >
            {petSearch || selectedPetFilterId
              ? "Nenhum alerta corresponde ao filtro."
              : "Nenhum alerta ativo."}
          </Text>
        }
        ListFooterComponent={
          <>
            <Text
              style={[
                styles_th.sectionTitle,
                {
                  marginTop: 20,
                  marginBottom: 10,
                },
              ]}
            >
              Alertas desativados
            </Text>

            {inactiveAlerts.map(
              (
                item,
              ) => (
                <View
                  key={
                    item.id
                  }
                  style={[
                    styles_th.item,
                    {
                      opacity:
                        0.55,
                      borderWidth:
                        1,
                      borderColor:
                        "#bbb",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles_th.itemTitle,
                      {
                        textDecorationLine:
                          "line-through",
                      },
                    ]}
                  >
                    {
                      item.titulo
                    }
                  </Text>

                  <Text
                    style={
                      styles_th.itemDate
                    }
                  >
                    {item.petNome} •{" "}
                    {getAlertTypeLabel(
                      item.tipo,
                    )}
                  </Text>

                  {item.descricao ? (
                    <Text
                      style={
                        styles_th.itemDate
                      }
                    >
                      {
                        item.descricao
                      }
                    </Text>
                  ) : undefined}

                  <TouchableOpacity
                    disabled
                    style={{
                      marginTop: 12,
                      padding: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor:
                        "#BDBDBD",
                      alignItems:
                        "center",
                      backgroundColor:
                        "#EEEEEE",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "#757575",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Desativado
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
            )}
          </>
        }
      />

      {isVeterinarian ? (
        <AlertFormModal
          visible={
            modalVisible
          }
          pets={pets}
          onClose={() =>
            setModalVisible(
              false,
            )
          }
          onSubmit={async (
            data: CreateAlertData,
          ) => {
            await addAlert(
              data,
            );

            setModalVisible(
              false,
            );
          }}
        />
      ) : undefined}
    </View>
  );
};

export default Alerts;